"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ChatProvider } from "@/contexts/ChatContext";
import { Heart } from "lucide-react";

export const Assistant = () => {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <ChatProvider>
      <AssistantRuntimeProvider runtime={runtime}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4 bg-gradient-to-r from-blue-50 to-white">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">PerplexaCare</span>
                <span className="text-sm text-gray-500">AI Health Assistant</span>
              </div>
            </header>
            <Thread />
          </SidebarInset>
        </SidebarProvider>
      </AssistantRuntimeProvider>
    </ChatProvider>
  );
};
