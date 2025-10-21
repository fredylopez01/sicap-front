import { Home, User, MapPin, ArrowUpDown, UserCog2Icon } from "lucide-react";
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
      { title: "Sedes", url: "/dashboard/sedes", icon: MapPin },
      { title: "Usuarios", url: "/dashboard/usuarios", icon: User },
      {
        title: "Perfil",
        url: "/dashboard/perfil",
        icon: UserCog2Icon,
      },
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
        title: "Perfil",
        url: "/dashboard/perfil",
        icon: UserCog2Icon,
      },
    ],
  },
];
