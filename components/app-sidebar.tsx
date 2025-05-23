"use client";

import * as React from "react"
import { LogOut, User, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ThreadList } from "@/components/assistant-ui/thread-list"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { currentUser, userProfile, signOut } = useAuth();
  const [imageError, setImageError] = React.useState(false);

  // For debugging
  React.useEffect(() => {
    console.log("Current user photo URL:", currentUser?.photoURL);
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const photoURL = currentUser?.photoURL;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent/50">
              <Link href="/chat">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                  <Heart className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">PerplexaCare</span>
                  <span className="text-xs text-muted-foreground">AI Health Assistant</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <ThreadList />
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/80 rounded-lg transition-all duration-200 group">
              <div className="size-8 rounded-lg overflow-hidden flex items-center justify-center bg-muted ring-2 ring-border group-hover:ring-accent-foreground/20 transition-all">
                {photoURL && !imageError ? (
                  <Image
                    src={photoURL}
                    alt={currentUser?.displayName || userProfile?.fullName || "Profile"}
                    width={32}
                    height={32}
                    className="size-8 object-cover"
                    onError={() => {
                      console.error("Failed to load profile image:", photoURL);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <User className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-sm text-foreground group-hover:text-accent-foreground transition-colors">
                  {userProfile?.fullName || currentUser?.displayName || "Guest User"}
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">View Profile</span>
              </div>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
            >
              <div className="flex aspect-square size-4 items-center justify-center">
                <LogOut className="size-4" />
              </div>
              <span className="font-medium">Sign Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
} 