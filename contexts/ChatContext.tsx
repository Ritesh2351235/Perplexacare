import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
//import { healthAgentService } from '@/utils/healthAgent';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
  isQuestion?: boolean;
  messageType?: string;
  isEmergency?: boolean;
  references?: string[];
}

interface SessionStatus {
  hasActiveSession: boolean;
  isWaitingForResponse?: boolean;
  conversationState?: string;
  remainingQuestions?: number;
}

interface ChatContextType {
  userId: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  activeSession: SessionStatus | null;
  sendMessage: (message: string) => Promise<Message | null>;
  refreshHistory: () => Promise<void>;
  refreshSessionStatus: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  userId: '',
  messages: [],
  isLoading: false,
  error: null,
  activeSession: null,
  sendMessage: async () => null,
  refreshHistory: async () => { },
  refreshSessionStatus: async () => { },
});

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [userId, setUserId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<SessionStatus | null>(null);
  const { currentUser } = useAuth();

  // Initialize userId from currentUser or generate a guest ID
  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      const guestId = localStorage.getItem('guestUserId') || `guest-${uuidv4()}`;
      localStorage.setItem('guestUserId', guestId);
      setUserId(guestId);
    }
  }, [currentUser]);

  // Load conversation history when userId changes
  /*useEffect(() => {
    if (userId) {
      // We'll still try to load history and check session status, but we won't let errors affect the app
      try {
        loadConversationHistory();
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }

      try {
        checkSessionStatus();
      } catch (error) {
        console.error('Failed to check session status:', error);
      }
    }
  }, [userId]);*/

  /*const loadConversationHistory = async () => {
    try {
      // Set default empty history - this prevents errors from affecting the UI
      const defaultHistory = { conversationHistory: [] };

      // Try to get conversation history, but don't let errors propagate
      let data;
      try {
        data = await healthAgentService.getConversationHistory();
      } catch (error) {
        console.error('Error fetching conversation history:', error);
        data = defaultHistory;
      }

      // Process data only if it exists and has content
      if (data?.conversationHistory && data.conversationHistory.length > 0) {
        const formattedMessages = data.conversationHistory.map(item => [
          { type: 'user' as const, content: item.query, timestamp: item.timestamp },
          {
            type: 'agent' as const,
            content: item.response,
            isQuestion: item.isLoopbackQuestion,
            isEmergency: item.isEmergency,
            timestamp: item.timestamp
          }
        ]).flat();
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      // Don't propagate the error - just log it
    }
  };
  */

  /*const checkSessionStatus = async () => {
    try {
      // Default session status that won't break the app
      const defaultStatus = {
        hasActiveSession: false,
        isWaitingForResponse: false,
        conversationState: 'idle',
        remainingQuestions: 0
      };

      // Try to get session status, but don't let errors propagate
      let status;
      try {
        status = await healthAgentService.getSessionStatus();
      } catch (error) {
        console.error('Error fetching session status:', error);
        status = defaultStatus;
      }

      setActiveSession(status);
    } catch (error) {
      console.error('Failed to check session status:', error);
      // Set a default session status that won't break the app
      setActiveSession({
        hasActiveSession: false,
        isWaitingForResponse: false,
        conversationState: 'idle',
        remainingQuestions: 0
      });
    }
  };
  */

  const sendMessage = async (message: string): Promise<Message | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message to the UI immediately
      const userMessage: Message = {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ content: message }],
            userId
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        // Handle both string and object responses
        const content = typeof responseData.response === 'object'
          ? responseData.response.content
          : responseData.response;

        const references = typeof responseData.response === 'object'
          ? responseData.response.references || []
          : [];

        const agentMessage: Message = {
          type: 'agent',
          content,
          references,
          timestamp: responseData.timestamp || new Date().toISOString(),
          isQuestion: responseData.isLoopbackQuestion,
          messageType: responseData.messageType
        };

        setMessages(prev => [...prev, agentMessage]);
        setActiveSession(null);
        return agentMessage;
      } catch (error) {
        console.error('API request error:', error);
        setError('Failed to process your message. Please try again.');
        return null;
      }
    } catch (error) {
      console.error('Message sending error:', error);
      setError('Failed to send message');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHistory = async () => {
    // Currently a no-op since history loading is commented out
    console.log('History refresh requested');
  };

  const refreshSessionStatus = async () => {
    // Currently a no-op since session status check is commented out
    console.log('Session status refresh requested');
  };

  return (
    <ChatContext.Provider value={{
      userId,
      messages,
      isLoading,
      error,
      activeSession,
      sendMessage,
      refreshHistory,
      refreshSessionStatus,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext); 