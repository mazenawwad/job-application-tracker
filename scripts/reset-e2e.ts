import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function resetE2EDatabase() {
  try {
    const result = await prisma.application.deleteMany();

    console.log(`Deleted ${result.count} applications`);

    const passwordHash = await bcrypt.hash("testpass", 12);

    await prisma.user.upsert({
      where: {
        email: "test@test.com",
      },
      update: {
        passwordHash,
      },
      create: {
        email: "test@test.com",
        passwordHash,
      },
    });

    console.log("E2E user ready");
  } finally {
    await prisma.$disconnect();
  }
}

resetE2EDatabase();