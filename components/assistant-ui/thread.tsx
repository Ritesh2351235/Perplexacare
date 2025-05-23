import { ThreadPrimitive } from "@assistant-ui/react";
import { type FC, useState, useEffect, useRef } from "react";
import {
  ArrowDownIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  LinkIcon,
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-[bounce_1.4s_infinite_.1s] shadow-lg"></div>
      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-[bounce_1.4s_infinite_.2s] shadow-lg"></div>
      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-[bounce_1.4s_infinite_.3s] shadow-lg"></div>
    </div>
  );
};

const LoadingMessage = () => {
  return (
    <div className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
      <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
        <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-2xl border border-blue-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 text-white">
              <LoadingDots />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-600 text-sm font-medium">PerplexaCare is thinking</span>
            <span className="text-gray-500 text-xs">Analyzing your query with verified medical sources...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageContent: FC<{ content: string; references?: string[] }> = ({ content, references }) => {
  // Function to clean and extract reference URLs
  const cleanReferenceUrl = (url: string) => {
    try {
      // Check if the URL contains a title and URL separated by |
      if (url.includes('|')) {
        const [, actualUrl] = url.split('|');
        return actualUrl;
      }

      // If it's already a full URL, return it as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }

      // If it starts with localhost:3000 or localhost:3001, remove it
      if (url.startsWith('localhost:3000/') || url.startsWith('localhost:3001/')) {
        return url.replace(/localhost:\d+\//, '');
      }

      // If it starts with a slash, remove it
      if (url.startsWith('/')) {
        return url.slice(1);
      }

      // If it starts with @ (common in some reference formats), remove it
      if (url.startsWith('@')) {
        return url.slice(1);
      }

      return url;
    } catch (error) {
      console.error('Error cleaning reference URL:', error);
      return url;
    }
  };

  // Function to get display text for reference
  const getReferenceDisplayText = (ref: string) => {
    try {
      // If the reference contains a title and URL separated by |
      if (ref.includes('|')) {
        const [title] = ref.split('|');
        return title.trim();
      }
      // Otherwise just show the cleaned URL
      return cleanReferenceUrl(ref);
    } catch (error) {
      console.error('Error getting reference display text:', error);
      return ref;
    }
  };

  return (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-a:text-blue-600 prose-code:text-blue-600 prose-code:bg-blue-100 prose-code:rounded prose-code:px-1 prose-strong:text-black prose-strong:font-semibold">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            h1: (props) => <h1 className="text-xl font-bold mb-4" {...props} />,
            h2: (props) => <h2 className="text-lg font-semibold mb-3" {...props} />,
            h3: (props) => <h3 className="text-base font-semibold mb-2" {...props} />,
            p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
            ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
            ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
            li: (props) => <li className="leading-relaxed" {...props} />,
            a: (props) => (
              <a
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
                href={cleanReferenceUrl(props.href || '')}
                {...props}
              />
            ),
            code: (props: { inline?: boolean; children?: React.ReactNode }) => (
              props.inline ?
                <code className="bg-blue-100 text-blue-600 rounded px-1">{props.children}</code> :
                <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">{props.children}</code>
            ),
            blockquote: (props) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {references && references.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">References:</p>
          <div className="space-y-2">
            {references.map((ref, index) => (
              <a
                key={index}
                href={cleanReferenceUrl(ref)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                <span className="break-all">{getReferenceDisplayText(ref)}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Thread: FC = () => {
  const { messages, sendMessage, isLoading, error } = useChat();
  const [inputValue, setInputValue] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (viewportRef.current) {
      const scrollHeight = viewportRef.current.scrollHeight;
      viewportRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <ThreadPrimitive.Root
      className="bg-background box-border flex h-full flex-col overflow-hidden"
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
    >
      <ThreadPrimitive.Viewport
        ref={viewportRef}
        className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8"
      >
        {messages.length === 0 ? (
          <ThreadWelcome />
        ) : (
          <>
            {/* Display our messages with styling similar to ThreadPrimitive.Messages */}
            {messages.map((msg, index) => (
              <div key={index} className="w-full max-w-[var(--thread-max-width)] py-4">
                {msg.type === 'user' ? (
                  <div className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
                    <div className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5">
                      <button className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent">
                        <PencilIcon className="size-4" />
                      </button>
                    </div>
                    <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
                      <MessageContent
                        content={msg.content}
                        references={msg.references}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
                    <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
                      <MessageContent
                        content={msg.content}
                        references={msg.references}
                      />
                    </div>
                    <div className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1">
                      <button className="size-8 rounded-full flex items-center justify-center hover:bg-accent">
                        <CopyIcon className="size-4" />
                      </button>
                      <button className="size-8 rounded-full flex items-center justify-center hover:bg-accent">
                        <RefreshCwIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Show loading animation when isLoading is true */}
            {isLoading && <LoadingMessage />}
          </>
        )}

        <div className="min-h-8 flex-grow" />

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom />
          <div className="focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 flex w-full flex-wrap items-end rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-lg transition-all ease-in">
            <textarea
              rows={1}
              autoFocus
              placeholder="Ask me about your health concerns..."
              className="placeholder:text-gray-400 max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-3 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() && !isLoading) {
                    sendMessage(inputValue.trim());
                    setInputValue("");
                  }
                }
              }}
            />
            <button
              disabled={!inputValue.trim() || isLoading}
              onClick={() => {
                if (inputValue.trim() && !isLoading) {
                  sendMessage(inputValue.trim());
                  setInputValue("");
                }
              }}
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendHorizontalIcon className="h-4 w-4" />
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2 w-full">
              <p className="text-red-700 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
      <div className="flex w-full flex-grow flex-col items-center justify-center text-center space-y-6">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to PerplexaCare</h1>
            <p className="text-gray-600 max-w-md">
              Your AI-powered health assistant providing trusted medical insights from verified sources.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">Symptom Analysis</h3>
            <p className="text-xs text-gray-600">Get insights on symptoms and health concerns</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-green-50 border border-green-100">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">Trusted Sources</h3>
            <p className="text-xs text-gray-600">Information from Mayo Clinic, WebMD, NIH</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-purple-50 border border-purple-100">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">24/7 Available</h3>
            <p className="text-xs text-gray-600">Get health guidance anytime you need it</p>
          </div>
        </div>

        <p className="text-base font-medium text-gray-800">How can I help you today?</p>
      </div>
      <ThreadWelcomeSuggestions />
    </div>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  const { sendMessage } = useChat();

  const suggestions = [
    {
      text: "I've been having headaches and feeling tired lately. What could be causing this?",
      icon: "🤕"
    },
    {
      text: "What are the common symptoms of seasonal allergies and how can I manage them?",
      icon: "🌸"
    },
    {
      text: "I'm feeling anxious about my health. Can you help me understand my symptoms?",
      icon: "💚"
    },
    {
      text: "What should I know about maintaining a healthy lifestyle and preventing illness?",
      icon: "🍎"
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 text-center">Try asking about:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="hover:bg-accent/80 hover:border-blue-200 flex items-start justify-start rounded-xl border border-gray-200 p-4 transition-all duration-200 text-left group shadow-sm hover:shadow-md"
            onClick={() => {
              sendMessage(suggestion.text);
            }}
          >
            <span className="text-xl mr-3 mt-1">{suggestion.icon}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors leading-relaxed">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-6">
        <p className="text-xs text-yellow-800 text-center">
          <strong>Important:</strong> This AI assistant provides general health information and should not replace professional medical advice.
          Always consult with healthcare professionals for medical concerns.
        </p>
      </div>
    </div>
  );
};
