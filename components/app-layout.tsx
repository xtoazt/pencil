"use client"

import type React from "react"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  const getBreadcrumbTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/projects") return "Projects"
    if (pathname === "/history") return "History"
    if (pathname === "/settings") return "Settings"
    if (pathname.startsWith("/chat")) {
      const params = new URLSearchParams(pathname.split("?")[1] || "")
      const mode = params.get("mode")
      switch (mode) {
        case "chat":
          return "Smart Chat"
        case "code":
          return "Code Assistant"
        case "image":
          return "Image Creator"
        case "super":
          return "Super Mode"
        default:
          return "Chat"
      }
    }
    return "Pencil AI"
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
