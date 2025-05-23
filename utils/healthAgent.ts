// Type definitions
export interface HealthQueryResponse {
  response: string;
  isLoopbackQuestion: boolean;
  messageType?: string;
  remainingQuestions?: number;
  timestamp: string;
}

export interface SessionStatus {
  hasActiveSession: boolean;
  isWaitingForResponse?: boolean;
  conversationState?: string;
  remainingQuestions?: number;
}

export interface ConversationItem {
  query: string;
  response: string;
  isLoopbackQuestion: boolean;
  isEmergency?: boolean;
  timestamp: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_HEALTH_AGENT_API || 'http://localhost:3000';

export const healthAgentService = {
  // Send a query to the health agent
  async sendQuery(query: string, userId: string): Promise<HealthQueryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          userId
        })
      });

      let data;
      const responseText = await response.text();

      try {
        data = JSON.parse(responseText);
      } catch {
        data = { response: responseText };
      }

      if (!response.ok) {
        console.error('Health query API error:', {
          status: response.status,
          error: data,
          endpoint: `${API_BASE_URL}/api/health-query`
        });

        // If it's a backend initialization error, provide a more helpful response
        if (data.message?.includes('conversationStateDB is not defined')) {
          return {
            response: "I apologize, but the health service is currently initializing. Please try again in a moment.",
            isLoopbackQuestion: false,
            timestamp: new Date().toISOString()
          };
        }

        throw new Error(`Request failed with status ${response.status}`);
      }

      // Handle object response
      return {
        response: data.response || data,
        isLoopbackQuestion: data.isLoopbackQuestion || false,
        messageType: data.messageType,
        remainingQuestions: data.remainingQuestions,
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending query:', error);
      throw error;
    }
  },

  // Get session status
/*  async getSessionStatus(): Promise<SessionStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/session-status`);

      if (!response.ok) {
        console.error('Session status API error:', {
          status: response.status,
          endpoint: `${API_BASE_URL}/api/session-status`
        });
        return {
          hasActiveSession: false,
          isWaitingForResponse: false,
          conversationState: 'error',
          remainingQuestions: 0
        };
      }

      const data = await response.json();
      return {
        hasActiveSession: data.hasActiveSession || false,
        isWaitingForResponse: data.isWaitingForResponse || false,
        conversationState: data.conversationState || 'idle',
        remainingQuestions: data.remainingQuestions || 0
      };
    } catch (error) {
      console.error('Error getting session status:', error);
      return {
        hasActiveSession: false,
        isWaitingForResponse: false,
        conversationState: 'error',
        remainingQuestions: 0
      };
    }
  }*/

}; 