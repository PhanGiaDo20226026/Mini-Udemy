import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { authenticate, authorizeInstructor, AuthRequest } from "../middleware/auth";

export const lessonRouter = Router();

const createLessonSchema = z.object({
  title: z.string().min(3),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().min(0).optional(),
  order: z.number().min(1),
  free: z.boolean().optional(),
  courseId: z.string(),
});

const updateLessonSchema = createLessonSchema.partial().omit({ courseId: true });

// GET /api/lessons/course/:courseId - Get lessons for a course
lessonRouter.get("/course/:courseId", async (req: AuthRequest, res: Response) => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId: req.params.courseId },
    orderBy: { order: "asc" },
  });
  res.json({ lessons });
});

// GET /api/lessons/:id - Get single lesson
lessonRouter.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: req.params.id },
    include: { course: { select: { id: true, instructorId: true } } },
  });

  if (!lesson) throw new AppError(404, "Lesson not found");

  // Check if user is enrolled or is the instructor
  if (lesson.course.instructorId !== req.userId && !lesson.free) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: lesson.courseId } },
    });
    if (!enrollment) throw new AppError(403, "You must enroll in this course to access this lesson");
  }

  res.json({ lesson });
});

// POST /api/lessons - Create lesson (instructor only)
lessonRouter.post(
  "/",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const data = createLessonSchema.parse(req.body);

    const course = await prisma.course.findUnique({ where: { id: data.courseId } });
    if (!course) throw new AppError(404, "Course not found");
    if (course.instructorId !== req.userId) throw new AppError(403, "Not your course");

    const lesson = await prisma.lesson.create({ data });
    res.status(201).json({ lesson });
  }
);

// PUT /api/lessons/:id - Update lesson (instructor only)
lessonRouter.put(
  "/:id",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: true },
    });
    if (!lesson) throw new AppError(404, "Lesson not found");
    if (lesson.course.instructorId !== req.userId) throw new AppError(403, "Not your course");

    const data = updateLessonSchema.parse(req.body);
    const updated = await prisma.lesson.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ lesson: updated });
  }
);

// DELETE /api/lessons/:id - Delete lesson (instructor only)
lessonRouter.delete(
  "/:id",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: true },
    });
    if (!lesson) throw new AppError(404, "Lesson not found");
    if (lesson.course.instructorId !== req.userId) throw new AppError(403, "Not your course");

    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.json({ message: "Lesson deleted" });
  }
);
