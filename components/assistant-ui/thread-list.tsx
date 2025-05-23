import { FC } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export const ThreadList: FC = () => {
  const router = useRouter();

  const handleNewChat = () => {
    // Navigate to chat page and refresh to start a new conversation
    router.replace("/chat");
    // Use router.refresh() for better performance instead of window.location.reload()
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* New Chat Button */}
      <Button
        className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm"
        onClick={handleNewChat}
      >
        <PlusIcon className="size-4" />
        <span className="font-medium">New Conversation</span>
      </Button>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <div className="flex items-start gap-2">
          <MessageSquare className="size-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Start a new conversation</p>
            <p className="text-blue-600">
              Each session provides fresh, personalized health guidance powered by trusted medical sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 