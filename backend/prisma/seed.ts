import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "web-development" },
      update: {},
      create: { name: "Web Development", slug: "web-development" },
    }),
    prisma.category.upsert({
      where: { slug: "mobile-development" },
      update: {},
      create: { name: "Mobile Development", slug: "mobile-development" },
    }),
    prisma.category.upsert({
      where: { slug: "data-science" },
      update: {},
      create: { name: "Data Science", slug: "data-science" },
    }),
    prisma.category.upsert({
      where: { slug: "devops" },
      update: {},
      create: { name: "DevOps", slug: "devops" },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: { name: "Design", slug: "design" },
    }),
  ]);

  // Create instructor
  const hashedPassword = await bcrypt.hash("password123", 10);
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@miniudemy.com" },
    update: {},
    create: {
      email: "instructor@miniudemy.com",
      password: hashedPassword,
      name: "Nguyen Van A",
      role: "INSTRUCTOR",
      bio: "Senior developer with 10+ years of experience",
    },
  });

  // Create student
  const student = await prisma.user.upsert({
    where: { email: "student@miniudemy.com" },
    update: {},
    create: {
      email: "student@miniudemy.com",
      password: hashedPassword,
      name: "Tran Van B",
      role: "STUDENT",
    },
  });

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: "seed-course-nextjs" },
    update: {},
    create: {
      id: "seed-course-nextjs",
      title: "Mastering Next.js 14 - Full Course",
      description:
        "Learn Next.js 14 from scratch. Build modern full-stack web applications with React Server Components, App Router, and more.",
      price: 499000,
      level: "INTERMEDIATE",
      published: true,
      instructorId: instructor.id,
      thumbnail: "https://placehold.co/600x400?text=Next.js+14",
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: "seed-course-docker" },
    update: {},
    create: {
      id: "seed-course-docker",
      title: "Docker & Kubernetes for Beginners",
      description:
        "Master containerization with Docker and orchestration with Kubernetes. Deploy your applications like a pro.",
      price: 399000,
      level: "BEGINNER",
      published: true,
      instructorId: instructor.id,
      thumbnail: "https://placehold.co/600x400?text=Docker",
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: "seed-course-react-native" },
    update: {},
    create: {
      id: "seed-course-react-native",
      title: "React Native - Build Mobile Apps",
      description:
        "Build cross-platform mobile applications with React Native. From setup to deployment on App Store and Google Play.",
      price: 599000,
      level: "ADVANCED",
      published: true,
      instructorId: instructor.id,
      thumbnail: "https://placehold.co/600x400?text=React+Native",
    },
  });

  // Link courses to categories
  await prisma.categoriesOnCourses.createMany({
    data: [
      { courseId: course1.id, categoryId: categories[0].id },
      { courseId: course2.id, categoryId: categories[3].id },
      { courseId: course3.id, categoryId: categories[1].id },
    ],
    skipDuplicates: true,
  });

  // Create lessons for course 1
  const lessons = [
    { title: "Introduction to Next.js", content: "Welcome to the course! In this lesson...", order: 1, free: true, duration: 600 },
    { title: "Setting up the Project", content: "Let's set up our development environment...", order: 2, free: true, duration: 900 },
    { title: "App Router Basics", content: "Understanding the new App Router...", order: 3, free: false, duration: 1200 },
    { title: "Server Components", content: "React Server Components explained...", order: 4, free: false, duration: 1500 },
    { title: "Data Fetching Patterns", content: "Learn different data fetching strategies...", order: 5, free: false, duration: 1800 },
    { title: "Authentication with NextAuth", content: "Implementing auth in Next.js...", order: 6, free: false, duration: 2100 },
    { title: "Deploying to Production", content: "Deploy your app to Vercel...", order: 7, free: false, duration: 1200 },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: `seed-lesson-${lesson.order}` },
      update: {},
      create: {
        id: `seed-lesson-${lesson.order}`,
        ...lesson,
        courseId: course1.id,
      },
    });
  }

  // Create enrollment
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course1.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course1.id,
    },
  });

  // Create review
  await prisma.review.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course1.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course1.id,
      rating: 5,
      comment: "Excellent course! Very well structured and easy to follow.",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
