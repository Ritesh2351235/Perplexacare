import { prisma } from "@/lib/prisma";

// Use a consistent guest user ID for all requests
const GUEST_USER_ID = "guest-user-id";

export async function GET() {
  try {
    const userId = GUEST_USER_ID;

    const healthProfile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (!healthProfile) {
      return new Response(JSON.stringify({}), { status: 200 });
    }

    return new Response(JSON.stringify(healthProfile), { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = GUEST_USER_ID;

    const data = await req.json();

    // Validate and transform the data
    const transformedData = {
      fullName: data.fullName || null,
      age: data.age ? parseInt(data.age) : null,
      gender: data.gender || null,
      height: data.height ? parseFloat(data.height) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      occupation: data.occupation || null,
      medicalHistory: Array.isArray(data.medicalHistory) ? data.medicalHistory :
        typeof data.medicalHistory === 'string' ? data.medicalHistory.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
      currentMedications: Array.isArray(data.currentMedications) ? data.currentMedications :
        typeof data.currentMedications === 'string' ? data.currentMedications.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
      allergies: Array.isArray(data.allergies) ? data.allergies :
        typeof data.allergies === 'string' ? data.allergies.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactPhone: data.emergencyContactPhone || null,
    };

    const healthProfile = await prisma.healthProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...transformedData,
      },
      update: transformedData,
    });

    return new Response(JSON.stringify(healthProfile), { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 