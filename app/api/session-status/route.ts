import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function GET() {
  try {
    // For now, we'll return a simple response indicating no active session
    // This can be enhanced later to check actual session state from a database
    return NextResponse.json({
      hasActiveSession: false,
      isWaitingForResponse: false,
      conversationState: 'idle',
      remainingQuestions: 0
    });
  } catch (error) {
    console.error("Error checking session status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 