"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  MessageSquare,
  Code,
  ImageIcon,
  Zap,
  FolderOpen,
  Settings,
  LogOut,
  ChevronUp,
  Plus,
  History,
  Terminal,
  Brain,
  Wand2,
  Palette,
  Cpu,
  User,
  Zap,
} from "lucide-react"
import Link from "next/link"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Code Studio",
    url: "/code",
    icon: Terminal,
  },
  {
    title: "Image Lab",
    url: "/image",
    icon: ImageIcon,
  },
  {
    title: "Super Mode",
    url: "/super",
    icon: Brain,
  },
  {
    title: "Instant Mode",
    url: "/instant",
    icon: Zap,
  },
]

const projectItems = [
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
]

const accountItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [recentChats, setRecentChats] = useState([])

  useEffect(() => {
    // Fetch recent conversations
    fetchRecentChats()
  }, [])

  const fetchRecentChats = async () => {
    try {
      const response = await fetch("/api/conversations/recent")
      if (response.ok) {
        const data = await response.json()
        setRecentChats(data.slice(0, 5)) // Show only 5 recent chats
      }
    } catch (error) {
      console.error("Failed to fetch recent chats:", error)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-8 w-8 items-center justify-center bg-primary">
            <Code className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground monospace">PENCIL</span>
            <span className="text-xs text-muted-foreground">AI STUDIO</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">TOOLS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url)} className="hover:bg-muted/50">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects & History */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">WORKSPACE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="hover:bg-muted/50">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">ACCOUNT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="hover:bg-muted/50">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Conversations */}
        {recentChats.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">RECENT</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentChats.map((chat: any) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild className="hover:bg-muted/50">
                      <Link href={`/chat/${chat.id}`}>
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate font-medium">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">QUICK</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-muted/50">
                  <Link href="/chat">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">New Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-muted/50">
                  <Link href="/super">
                    <Brain className="h-4 w-4" />
                    <span className="font-medium">Super Mode</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium truncate">{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">@{user?.username}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
