import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { adminSidebar, userSidebar } from "@/config/sidebarItems";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const role = user ? user.role : "admin";
  const sidebarConfig = role === "ADMIN" ? adminSidebar : userSidebar;

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        {/* Sidebar dinámico según el rol */}
        <AppSidebar groups={sidebarConfig} />

        {/* Contenido principal */}
        <main className="flex-1 p-4 bg-gray-100">
          <header className="flex items-center justify-between mb-1 ">
            <SidebarTrigger />
          </header>

          {/* Aquí se renderizan las vistas hijas */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
