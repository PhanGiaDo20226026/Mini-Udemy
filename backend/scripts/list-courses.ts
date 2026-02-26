import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function run() {
  const courses = await p.course.findMany({ select: { id: true, title: true } });
  console.log("COURSES:", JSON.stringify(courses, null, 2));
  await p.$disconnect();
}
run();
