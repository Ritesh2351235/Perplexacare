import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return empty conversation history for now
    // This can be enhanced later to retrieve actual conversation history from a database
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error retrieving conversation history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 