import { healthAgentService } from "@/utils/healthAgent";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages, userId } = data;

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    // Get the user's message (the last message in the array)
    const userMessage = messages && messages.length > 0 ?
      String(messages[messages.length - 1].content || "") : "";

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return new Response("No valid message content provided", { status: 400 });
    }

    console.log(`Processing health query for user ${userId}: "${userMessage}"`);

    try {
      const healthResponse = await healthAgentService.sendQuery(userMessage, userId);

      if (!healthResponse || !healthResponse.response) {
        return new Response("Invalid response from health agent API", { status: 500 });
      }

      console.log("Health agent API response:", healthResponse);

      // Return the structured response as JSON
      return new Response(JSON.stringify(healthResponse), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Health agent API error:", error);
      return new Response(
        "Sorry, I'm having trouble processing your request right now. Please try again later.",
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
