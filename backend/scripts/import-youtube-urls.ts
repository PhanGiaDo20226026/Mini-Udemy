import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const COURSE_ID = "cmm2wm07i0003xslp9hkovnr3";

async function main() {
  // Read YouTube URLs from file
  const filePath = path.join(__dirname, "../public/link_youtube.txt");
  const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");

  const urls: string[] = lines.map((line) => {
    // Format: "0\thttps://www.youtube.com/watch?v=..."
    const parts = line.split("\t");
    return parts[1]?.trim() || "";
  }).filter(Boolean);

  console.log(`Read ${urls.length} YouTube URLs from file`);

  // Get lessons
  const lessons = await prisma.lesson.findMany({
    where: { courseId: COURSE_ID },
    orderBy: { order: "asc" },
  });

  console.log(`Found ${lessons.length} lessons in DB`);

  const count = Math.min(urls.length, lessons.length);

  for (let i = 0; i < count; i++) {
    const url = urls[i];
    // Extract clean YouTube watch URL (remove playlist params)
    const match = url.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
    const cleanUrl = match
      ? `https://www.youtube.com/watch?v=${match[1]}`
      : url;

    await prisma.lesson.update({
      where: { id: lessons[i].id },
      data: { videoUrl: cleanUrl },
    });

    console.log(`  [${i + 1}/${count}] ${lessons[i].title} -> ${cleanUrl}`);
  }

  console.log(`\nDone! Updated ${count} lessons with YouTube URLs.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
