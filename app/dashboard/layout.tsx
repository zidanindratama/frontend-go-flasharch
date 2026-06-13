"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSidebarOpen(!isMobile))
    return () => cancelAnimationFrame(frame)
  }, [isMobile])

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="min-w-0 bg-background">
          <div className="min-w-0 w-full p-4 sm:p-5 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
