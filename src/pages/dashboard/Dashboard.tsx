import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { adminSidebar, userSidebar } from "@/config/sidebarItems"

export default function Dashboard() {
  const role = "admin" // esto vendría de tu contexto de auth
  const sidebarConfig = role === "admin" ? adminSidebar : userSidebar

  return (
    <SidebarProvider>
      <div className="flex">
        {/* Sidebar dinámico según el rol */}
        <AppSidebar groups={sidebarConfig} />

        {/* Contenido principal */}
        <main className="flex-1 p-4">
            <SidebarTrigger />
          <h1>Dashboard</h1>
        </main>
      </div>
    </SidebarProvider>
  )
}
