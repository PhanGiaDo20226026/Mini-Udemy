import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.update({
    where: { id: "cmm2wm07i0003xslp9hkovnr3" },
    data: {
      title: "Kho\u00e1 h\u1ecdc ph\u00e1t \u00e2m Ti\u1ebfng Anh",
      description:
        "Kho\u00e1 h\u1ecdc ph\u00e1t \u00e2m Ti\u1ebfng Anh t\u1eeb c\u01a1 b\u1ea3n \u0111\u1ebfn n\u00e2ng cao. " +
        "H\u1ecdc c\u00e1ch ph\u00e1t \u00e2m chu\u1ea9n 44 \u00e2m trong Ti\u1ebfng Anh " +
        "(nguy\u00ean \u00e2m, ph\u1ee5 \u00e2m), n\u1ed1i \u00e2m, nh\u1ea5n \u00e2m, ng\u1eef \u0111i\u1ec7u. " +
        "Ph\u00f9 h\u1ee3p cho ng\u01b0\u1eddi m\u1edbi b\u1eaft \u0111\u1ea7u v\u00e0 ng\u01b0\u1eddi mu\u1ed1n c\u1ea3i thi\u1ec7n ph\u00e1t \u00e2m.",
    },
  });

  console.log("Updated course:");
  console.log("  Title:", course.title);
  console.log("  Description:", course.description);

  // Also update lesson titles with proper Vietnamese
  const lessonTitles: Record<number, string> = {
    1: "Gi\u1edbi thi\u1ec7u kh\u00f3a h\u1ecdc v\u00e0 ph\u01b0\u01a1ng ph\u00e1p h\u1ecdc",
    2: "Ph\u00e1t \u00e2m /p/",
    3: "Ph\u00e1t \u00e2m /b/",
    4: "Ph\u00e1t \u00e2m /t/",
    5: "Ph\u00e1t \u00e2m /d/",
    6: "Ph\u00e1t \u00e2m /k/",
    7: "Ph\u00e1t \u00e2m /g/",
    8: "Ph\u00e1t \u00e2m /f/",
    9: "Ph\u00e1t \u00e2m /v/",
    10: "Ph\u00e1t \u00e2m /\u03b8/",
    11: "Ph\u00e1t \u00e2m /\u00f0/",
    12: "Ph\u00e1t \u00e2m /s/",
    13: "Ph\u00e1t \u00e2m /z/",
    14: "Ph\u00e1t \u00e2m /\u0283/",
    15: "Ph\u00e1t \u00e2m /\u0292/",
    16: "Ph\u00e1t \u00e2m /t\u0283/",
    17: "Ph\u00e1t \u00e2m /d\u0292/",
    18: "Ph\u00e1t \u00e2m /h/",
    19: "Ph\u00e1t \u00e2m /m/",
    20: "Ph\u00e1t \u00e2m /n/",
    21: "Ph\u00e1t \u00e2m /\u014b/",
    22: "Ph\u00e1t \u00e2m /r/",
    23: "Ph\u00e1t \u00e2m /l/",
    24: "Ph\u00e1t \u00e2m /w/",
    25: "Ph\u00e1t \u00e2m /j/",
    26: "Ph\u00e1t \u00e2m /\u026a/",
    27: "Ph\u00e1t \u00e2m /i\u02d0/",
    28: "Ph\u00e1t \u00e2m /\u028a/",
    29: "Ph\u00e1t \u00e2m /u\u02d0/",
    30: "Ph\u00e1t \u00e2m /e/",
    31: "Ph\u00e1t \u00e2m /\u0259/",
    32: "Ph\u00e1t \u00e2m /\u025c\u02d0/",
    33: "Ph\u00e1t \u00e2m /\u0254\u02d0/",
    34: "Ph\u00e1t \u00e2m /\u00e6/",
    35: "Ph\u00e1t \u00e2m /\u028c/",
    36: "Ph\u00e1t \u00e2m /\u0251\u02d0/",
    37: "Ph\u00e1t \u00e2m /e\u0259/",
    38: "Ph\u00e1t \u00e2m /e\u026a/",
    39: "Ph\u00e1t \u00e2m /\u0254\u026a/",
    40: "Ph\u00e1t \u00e2m /\u0259\u028a/",
    41: "Ph\u00e1t \u00e2m /\u026a\u0259/",
    42: "Ph\u00e1t \u00e2m /a\u026a/",
    43: "Ph\u00e1t \u00e2m /a\u028a/",
  };

  const lessons = await prisma.lesson.findMany({
    where: { courseId: "cmm2wm07i0003xslp9hkovnr3" },
    orderBy: { order: "asc" },
  });

  for (const lesson of lessons) {
    const newTitle = lessonTitles[lesson.order];
    if (newTitle) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          title: `B\u00e0i ${lesson.order}: ${newTitle}`,
          content: `Video h\u01b0\u1edbng d\u1eabn ph\u00e1t \u00e2m b\u00e0i ${lesson.order}`,
        },
      });
      console.log(`  [${lesson.order}] B\u00e0i ${lesson.order}: ${newTitle}`);
    }
  }

  console.log("\nDone! Updated course + all lesson titles.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
