/**
 * Script: C\u1eadp nh\u1eadt videoUrl c\u1ee7a b\u00e0i h\u1ecdc v\u1edbi link YouTube
 *
 * C\u00e1ch d\u00f9ng:
 *   1. Upload 43 video l\u00ean YouTube (Unlisted)
 *   2. \u0110i\u1ec1n YouTube URL v\u00e0o m\u1ea3ng YOUTUBE_URLS b\u00ean d\u01b0\u1edbi (theo \u0111\u00fang th\u1ee9 t\u1ef1 b\u00e0i h\u1ecdc)
 *   3. Ch\u1ea1y: npx ts-node scripts/set-youtube-urls.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COURSE_ID = "cmm2wm07i0003xslp9hkovnr3";

// ====================================================================
// \u0110I\u1ec0N YOUTUBE URL V\u00c0O \u0110\u00c2Y (th\u1ee9 t\u1ef1 b\u00e0i 1 \u2192 43)
// Ch\u1ec9 c\u1ea7n YouTube URL b\u00ecnh th\u01b0\u1eddng, v\u00ed d\u1ee5:
//   "https://www.youtube.com/watch?v=VIDEO_ID"
//   ho\u1eb7c "https://youtu.be/VIDEO_ID"
// ====================================================================
const YOUTUBE_URLS: string[] = [
  // B\u00e0i 1: Gi\u1edbi thi\u1ec7u kh\u00f3a h\u1ecdc
  "https://www.youtube.com/watch?v=REPLACE_ME_1",
  // B\u00e0i 2: Ph\u00e1t \u00e2m /p/
  "https://www.youtube.com/watch?v=REPLACE_ME_2",
  // B\u00e0i 3: Ph\u00e1t \u00e2m /b/
  "https://www.youtube.com/watch?v=REPLACE_ME_3",
  // B\u00e0i 4: Ph\u00e1t \u00e2m /t/
  "https://www.youtube.com/watch?v=REPLACE_ME_4",
  // B\u00e0i 5: Ph\u00e1t \u00e2m /d/
  "https://www.youtube.com/watch?v=REPLACE_ME_5",
  // B\u00e0i 6: Ph\u00e1t \u00e2m /k/
  "https://www.youtube.com/watch?v=REPLACE_ME_6",
  // B\u00e0i 7: Ph\u00e1t \u00e2m /g/
  "https://www.youtube.com/watch?v=REPLACE_ME_7",
  // B\u00e0i 8: Ph\u00e1t \u00e2m /f/
  "https://www.youtube.com/watch?v=REPLACE_ME_8",
  // B\u00e0i 9: Ph\u00e1t \u00e2m /v/
  "https://www.youtube.com/watch?v=REPLACE_ME_9",
  // B\u00e0i 10: Ph\u00e1t \u00e2m /\u03b8/
  "https://www.youtube.com/watch?v=REPLACE_ME_10",
  // B\u00e0i 11: Ph\u00e1t \u00e2m /\u00f0/
  "https://www.youtube.com/watch?v=REPLACE_ME_11",
  // B\u00e0i 12: Ph\u00e1t \u00e2m /s/
  "https://www.youtube.com/watch?v=REPLACE_ME_12",
  // B\u00e0i 13: Ph\u00e1t \u00e2m /z/
  "https://www.youtube.com/watch?v=REPLACE_ME_13",
  // B\u00e0i 14: Ph\u00e1t \u00e2m /\u0283/
  "https://www.youtube.com/watch?v=REPLACE_ME_14",
  // B\u00e0i 15: Ph\u00e1t \u00e2m /\u0292/
  "https://www.youtube.com/watch?v=REPLACE_ME_15",
  // B\u00e0i 16: Ph\u00e1t \u00e2m /t\u0283/
  "https://www.youtube.com/watch?v=REPLACE_ME_16",
  // B\u00e0i 17: Ph\u00e1t \u00e2m /d\u0292/
  "https://www.youtube.com/watch?v=REPLACE_ME_17",
  // B\u00e0i 18: Ph\u00e1t \u00e2m /h/
  "https://www.youtube.com/watch?v=REPLACE_ME_18",
  // B\u00e0i 19: Ph\u00e1t \u00e2m /m/
  "https://www.youtube.com/watch?v=REPLACE_ME_19",
  // B\u00e0i 20: Ph\u00e1t \u00e2m /n/
  "https://www.youtube.com/watch?v=REPLACE_ME_20",
  // B\u00e0i 21: Ph\u00e1t \u00e2m /\u014b/
  "https://www.youtube.com/watch?v=REPLACE_ME_21",
  // B\u00e0i 22: Ph\u00e1t \u00e2m /r/
  "https://www.youtube.com/watch?v=REPLACE_ME_22",
  // B\u00e0i 23: Ph\u00e1t \u00e2m /l/
  "https://www.youtube.com/watch?v=REPLACE_ME_23",
  // B\u00e0i 24: Ph\u00e1t \u00e2m /w/
  "https://www.youtube.com/watch?v=REPLACE_ME_24",
  // B\u00e0i 25: Ph\u00e1t \u00e2m /j/
  "https://www.youtube.com/watch?v=REPLACE_ME_25",
  // B\u00e0i 26: Ph\u00e1t \u00e2m /\u026a/
  "https://www.youtube.com/watch?v=REPLACE_ME_26",
  // B\u00e0i 27: Ph\u00e1t \u00e2m /i\u02d0/
  "https://www.youtube.com/watch?v=REPLACE_ME_27",
  // B\u00e0i 28: Ph\u00e1t \u00e2m /\u028a/
  "https://www.youtube.com/watch?v=REPLACE_ME_28",
  // B\u00e0i 29: Ph\u00e1t \u00e2m /u\u02d0/
  "https://www.youtube.com/watch?v=REPLACE_ME_29",
  // B\u00e0i 30: Ph\u00e1t \u00e2m /e/
  "https://www.youtube.com/watch?v=REPLACE_ME_30",
  // B\u00e0i 31: Ph\u00e1t \u00e2m /\u0259/
  "https://www.youtube.com/watch?v=REPLACE_ME_31",
  // B\u00e0i 32: Ph\u00e1t \u00e2m /\u025c\u02d0/
  "https://www.youtube.com/watch?v=REPLACE_ME_32",
  // B\u00e0i 33: Ph\u00e1t \u00e2m /\u0254\u02d0/
  "https://www.youtube.com/watch?v=REPLACE_ME_33",
  // B\u00e0i 34: Ph\u00e1t \u00e2m /\u00e6/
  "https://www.youtube.com/watch?v=REPLACE_ME_34",
  // B\u00e0i 35: Ph\u00e1t \u00e2m /\u028c/
  "https://www.youtube.com/watch?v=REPLACE_ME_35",
  // B\u00e0i 36: Ph\u00e1t \u00e2m /\u0251\u02d0/
  "https://www.youtube.com/watch?v=REPLACE_ME_36",
  // B\u00e0i 37: Ph\u00e1t \u00e2m /e\u0259/
  "https://www.youtube.com/watch?v=REPLACE_ME_37",
  // B\u00e0i 38: Ph\u00e1t \u00e2m /e\u026a/
  "https://www.youtube.com/watch?v=REPLACE_ME_38",
  // B\u00e0i 39: Ph\u00e1t \u00e2m /\u0254\u026a/
  "https://www.youtube.com/watch?v=REPLACE_ME_39",
  // B\u00e0i 40: Ph\u00e1t \u00e2m /\u0259\u028a/
  "https://www.youtube.com/watch?v=REPLACE_ME_40",
  // B\u00e0i 41: Ph\u00e1t \u00e2m /\u026a\u0259/
  "https://www.youtube.com/watch?v=REPLACE_ME_41",
  // B\u00e0i 42: Ph\u00e1t \u00e2m /a\u026a/
  "https://www.youtube.com/watch?v=REPLACE_ME_42",
  // B\u00e0i 43: Ph\u00e1t \u00e2m /a\u028a/
  "https://www.youtube.com/watch?v=REPLACE_ME_43",
];

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { courseId: COURSE_ID },
    orderBy: { order: "asc" },
  });

  if (lessons.length !== YOUTUBE_URLS.length) {
    console.error(
      `Loi: Co ${lessons.length} bai hoc nhung chi co ${YOUTUBE_URLS.length} URL. Can khop so luong!`
    );
    process.exit(1);
  }

  let updated = 0;
  for (let i = 0; i < lessons.length; i++) {
    const url = YOUTUBE_URLS[i];
    if (url.includes("REPLACE_ME")) {
      console.log(`  [${i + 1}] SKIP - Chua dien URL: ${lessons[i].title}`);
      continue;
    }

    await prisma.lesson.update({
      where: { id: lessons[i].id },
      data: { videoUrl: url },
    });

    console.log(`  [${i + 1}] OK - ${lessons[i].title} -> ${url}`);
    updated++;
  }

  console.log(`\nDa cap nhat ${updated}/${lessons.length} bai hoc.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
