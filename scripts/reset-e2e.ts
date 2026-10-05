import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function resetE2EDatabase() {
  try {
    const applicationResult = await prisma.application.deleteMany();
    const userResult = await prisma.user.deleteMany();

    console.log(`Deleted ${applicationResult.count} applications`);
    console.log(`Deleted ${userResult.count} users`);

    const passwordHash = await bcrypt.hash("testpass", 12);

    await prisma.user.create({
      data: {
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