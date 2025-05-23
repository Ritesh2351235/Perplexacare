import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    const userId = session.userId;
    const user = await currentUser();

    if (!userId || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create or update user and health profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create/update user
      const dbUser = await tx.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        },
        update: {
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        },
      });

      // Create/update health profile
      const healthProfile = await tx.healthProfile.upsert({
        where: { userId: dbUser.id },
        create: {
          userId: dbUser.id,
          fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null,
          medicalHistory: [],
          currentMedications: [],
          allergies: [],
        },
        update: {},
      });

      return { user: dbUser, profile: healthProfile };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error in signup process:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 