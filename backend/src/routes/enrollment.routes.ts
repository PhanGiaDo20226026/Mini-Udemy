import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { authenticate, AuthRequest } from "../middleware/auth";

export const enrollmentRouter = Router();

// POST /api/enrollments - Enroll in a course
enrollmentRouter.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { courseId } = z.object({ courseId: z.string() }).parse(req.body);

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(404, "Course not found");
  if (!course.published) throw new AppError(400, "Course is not available");

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.userId!, courseId } },
  });
  if (existing) throw new AppError(409, "Already enrolled");

  const enrollment = await prisma.enrollment.create({
    data: { userId: req.userId!, courseId },
    include: { course: { select: { id: true, title: true } } },
  });

  res.status(201).json({ enrollment });
});

// GET /api/enrollments/my - Get user's enrollments
enrollmentRouter.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.userId },
    include: {
      course: {
        include: {
          instructor: { select: { id: true, name: true } },
          _count: { select: { lessons: true } },
        },
      },
      progress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate progress percentage
  const enriched = enrollments.map((enrollment) => {
    const totalLessons = enrollment.course._count.lessons;
    const completedLessons = enrollment.progress.filter((p) => p.completed).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return { ...enrollment, progressPercent };
  });

  res.json({ enrollments: enriched });
});

// POST /api/enrollments/progress - Mark lesson as completed
enrollmentRouter.post("/progress", authenticate, async (req: AuthRequest, res: Response) => {
  const { lessonId } = z.object({ lessonId: z.string() }).parse(req.body);

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw new AppError(404, "Lesson not found");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.userId!, courseId: lesson.courseId } },
  });
  if (!enrollment) throw new AppError(403, "Not enrolled in this course");

  const progress = await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { enrollmentId: enrollment.id, lessonId, completed: true, completedAt: new Date() },
  });

  res.json({ progress });
});

// POST /api/enrollments/review - Add review to a course
enrollmentRouter.post("/review", authenticate, async (req: AuthRequest, res: Response) => {
  const data = z
    .object({
      courseId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    })
    .parse(req.body);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.userId!, courseId: data.courseId } },
  });
  if (!enrollment) throw new AppError(403, "You must be enrolled to review");

  const review = await prisma.review.upsert({
    where: { userId_courseId: { userId: req.userId!, courseId: data.courseId } },
    update: { rating: data.rating, comment: data.comment },
    create: { userId: req.userId!, courseId: data.courseId, rating: data.rating, comment: data.comment },
  });

  res.json({ review });
});
