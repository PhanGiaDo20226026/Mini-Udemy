import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { authenticate, authorizeInstructor, AuthRequest } from "../middleware/auth";

export const courseRouter = Router();

// Validation
const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  thumbnail: z.string().url().optional(),
  categoryIds: z.array(z.string()).optional(),
});

const updateCourseSchema = createCourseSchema.partial().extend({
  published: z.boolean().optional(),
});

// GET /api/courses - List all published courses
courseRouter.get("/", async (req: Request, res: Response) => {
  const { search, level, categoryId, page = "1", limit = "12" } = req.query;

  const where: any = { published: true };

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
    ];
  }
  if (level) {
    where.level = level;
  }
  if (categoryId) {
    where.categories = { some: { categoryId: categoryId as string } };
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take,
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        categories: { include: { category: true } },
        _count: { select: { enrollments: true, lessons: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where }),
  ]);

  // Calculate average rating for each course
  const coursesWithRating = await Promise.all(
    courses.map(async (course: any) => {
      const avgRating = await prisma.review.aggregate({
        where: { courseId: course.id },
        _avg: { rating: true },
      });
      return {
        ...course,
        avgRating: avgRating._avg.rating || 0,
      };
    })
  );

  res.json({
    courses: coursesWithRating,
    pagination: {
      total,
      page: parseInt(page as string),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  });
});

// GET /api/courses/:id - Get course detail
courseRouter.get("/:id", async (req: Request, res: Response) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      instructor: { select: { id: true, name: true, avatar: true, bio: true } },
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, duration: true, order: true, free: true },
      },
      categories: { include: { category: true } },
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { enrollments: true, lessons: true, reviews: true } },
    },
  });

  if (!course) {
    throw new AppError(404, "Course not found");
  }

  const avgRating = await prisma.review.aggregate({
    where: { courseId: course.id },
    _avg: { rating: true },
  });

  res.json({ course: { ...course, avgRating: avgRating._avg.rating || 0 } });
});

// POST /api/courses - Create course (instructor only)
courseRouter.post(
  "/",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const data = createCourseSchema.parse(req.body);

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price || 0,
        level: data.level || "BEGINNER",
        thumbnail: data.thumbnail,
        instructorId: req.userId!,
        categories: data.categoryIds
          ? {
              create: data.categoryIds.map((catId) => ({
                categoryId: catId,
              })),
            }
          : undefined,
      },
      include: {
        instructor: { select: { id: true, name: true } },
        categories: { include: { category: true } },
      },
    });

    res.status(201).json({ course });
  }
);

// PUT /api/courses/:id - Update course (instructor only)
courseRouter.put(
  "/:id",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const existing = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, "Course not found");
    if (existing.instructorId !== req.userId) throw new AppError(403, "Not your course");

    const data = updateCourseSchema.parse(req.body);

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        level: data.level,
        thumbnail: data.thumbnail,
        published: data.published,
      },
      include: {
        instructor: { select: { id: true, name: true } },
      },
    });

    res.json({ course });
  }
);

// DELETE /api/courses/:id - Delete course (instructor only)
courseRouter.delete(
  "/:id",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const existing = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, "Course not found");
    if (existing.instructorId !== req.userId) throw new AppError(403, "Not your course");

    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: "Course deleted" });
  }
);

// GET /api/courses/instructor/my-courses - Get instructor's courses
courseRouter.get(
  "/instructor/my-courses",
  authenticate,
  authorizeInstructor,
  async (req: AuthRequest, res: Response) => {
    const courses = await prisma.course.findMany({
      where: { instructorId: req.userId },
      include: {
        _count: { select: { enrollments: true, lessons: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ courses });
  }
);

// GET /api/courses/categories/all - Get all categories
courseRouter.get("/categories/all", async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });
  res.json({ categories });
});
