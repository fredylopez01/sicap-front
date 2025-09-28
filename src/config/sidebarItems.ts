import { Home, Settings, User } from "lucide-react"
import { SidebarGroup } from "@/interfaces/sidebar"

export const adminSidebar: SidebarGroup[] = [
  {
    title: "General",
    items: [
      { title: "Home", url: "/dashboard", icon: Home },
      { title: "Users", url: "/dashboard/users", icon: User },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    title: "Parqueadero",
    items: [
      { title: "Reservas", url: "/dashboard/reservas", icon: Home },
      { title: "Usuarios", url: "/dashboard/usuarios", icon: User },
      { title: "Configuración", url: "/dashboard/configuracion", icon: Settings },
    ]
  }
]

export const userSidebar: SidebarGroup[] = [
  {
    title: "General",
    items: [
      { title: "Home", url: "/dashboard", icon: Home },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
]
