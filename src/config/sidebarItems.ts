import { Home, Settings, User, MapPin, ArrowUpDown } from "lucide-react";
import { SidebarGroup } from "@/interfaces/sidebar";

export const adminSidebar: SidebarGroup[] = [
  {
    title: "General",
    items: [{ title: "Home", url: "/dashboard", icon: Home }],
  },
  {
    title: "Parqueadero",
    items: [
      { title: "Registros", url: "/dashboard/registros", icon: ArrowUpDown },
      { title: "Usuarios", url: "/dashboard/usuarios", icon: User },
      {
        title: "Configuración",
        url: "/dashboard/configuracion",
        icon: Settings,
      },
      { title: "Sedes", url: "/dashboard/sedes", icon: MapPin },
    ],
  },
];

export const userSidebar: SidebarGroup[] = [
  {
    title: "General",
    items: [
      { title: "Home", url: "/dashboard", icon: Home },
      { title: "Registros", url: "/dashboard/registros", icon: ArrowUpDown },
      {
        title: "Configuración",
        url: "/dashboard/configuracion",
        icon: Settings,
      },
    ],
  },
];
