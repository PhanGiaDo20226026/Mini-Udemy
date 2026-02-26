/**
 * Script: Đồng bộ bài học với file video thật trong thư mục public/videos/
 * 
 * Script sẽ:
 *   1. Quét tất cả file .mp4 trong backend/public/videos/
 *   2. Xoá toàn bộ bài học cũ của khoá phát âm
 *   3. Tạo mới bài học khớp với từng file video
 * 
 * Chạy: npx ts-node scripts/update-video-urls.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const VIDEO_DIR = path.join(__dirname, "../public/videos");
const BASE_URL = process.env.BACKEND_URL || "http://localhost:4000";

const COURSE_ID = process.env.COURSE_ID || "cmm2wm07i0003xslp9hkovnr3";

async function main() {
  // Tìm khóa học theo ID
  const course = await prisma.course.findUnique({
    where: { id: COURSE_ID },
  });

  if (!course) {
    console.error("Khong tim thay khoa hoc voi ID:", COURSE_ID);
    process.exit(1);
  }

  console.log(`Khoa hoc: ${course.title} (${course.id})`);

  // Đọc file video thật và sắp xếp theo số tập
  const videoFiles = fs
    .readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/Tập (\d+)/)?.[1] || "0");
      const numB = parseInt(b.match(/Tập (\d+)/)?.[1] || "0");
      return numA - numB;
    });

  console.log(`Tim thay ${videoFiles.length} file video`);

  if (videoFiles.length === 0) {
    console.error("Khong co file video nao trong thu muc!");
    process.exit(1);
  }

  // Xoá LessonProgress trước (vì có FK đến Lesson)
  const existingLessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
    select: { id: true },
  });
  const lessonIds = existingLessons.map((l) => l.id);

  if (lessonIds.length > 0) {
    const deletedProgress = await prisma.lessonProgress.deleteMany({
      where: { lessonId: { in: lessonIds } },
    });
    console.log(`Xoa ${deletedProgress.count} lesson progress`);
  }

  // Xoá lessons cũ
  const deletedLessons = await prisma.lesson.deleteMany({
    where: { courseId: course.id },
  });
  console.log(`Xoa ${deletedLessons.count} bai hoc cu`);

  // Tạo lại lessons từ file video thật
  for (let i = 0; i < videoFiles.length; i++) {
    const filename = videoFiles[i];
    // Trích xuất số tập và tên âm từ tên file
    // VD: "42 Ngày Phát Âm - Tập 10- -ð-.mp4" → episodeNum=10, sound="ð"
    const match = filename.match(/Tập (\d+)-\s*-([^-]+)-\.mp4/);
    const episodeNum = match?.[1] || String(i + 1);
    const sound = match?.[2] || "";

    const videoUrl = `${BASE_URL}/videos/${encodeURIComponent(filename)}`;
    const stats = fs.statSync(path.join(VIDEO_DIR, filename));
    const fileSizeMB = stats.size / (1024 * 1024);
    // Ước tính duration: ~1MB = 30s cho video thường
    const estimatedDuration = Math.round(fileSizeMB * 30);

    const title = sound
      ? `Bài ${episodeNum}: Phát âm /${sound}/`
      : `Bài ${episodeNum}: ${filename.replace(".mp4", "")}`;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: `Video hướng dẫn phát âm âm /${sound}/ trong tiếng Anh`,
        videoUrl,
        duration: estimatedDuration,
        order: i + 1,
        free: i < 3, // 3 bài đầu miễn phí
        courseId: course.id,
      },
    });

    console.log(
      `  [${i + 1}/${videoFiles.length}] ${lesson.title} (${fileSizeMB.toFixed(1)}MB, ~${estimatedDuration}s)`
    );
  }

  // Cập nhật tổng số bài học
  console.log(`\nDa tao ${videoFiles.length} bai hoc moi!`);
  console.log(`Video URL mau: ${BASE_URL}/videos/${encodeURIComponent(videoFiles[0])}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
