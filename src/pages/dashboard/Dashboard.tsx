import { ReactNode } from "react"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { adminSidebar, userSidebar } from "@/config/sidebarItems"

interface DashboardProps {
  children: ReactNode
}

export default function Dashboard({ children }: DashboardProps) {
  const role = "admin" // esto vendría de tu contexto de auth
  const sidebarConfig = role === "admin" ? adminSidebar : userSidebar

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        {/* Sidebar dinámico según el rol */}
        <AppSidebar groups={sidebarConfig} />

        {/* Contenido principal */}
        <main className="flex-1 p-4 bg-gray-100">
          <header className="flex items-center justify-between mb-4 ">
            <SidebarTrigger/>
          </header>

          {/* Aquí se renderizan las vistas hijas */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
