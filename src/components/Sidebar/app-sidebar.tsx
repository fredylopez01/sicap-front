import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import { ChevronUp, User2 } from "lucide-react"
import logo from "/logo.jpg"
import { SidebarGroup as SidebarGroupType } from "@/interfaces/sidebar"

interface AppSidebarProps {
  groups: SidebarGroupType[]
}

export function AppSidebar({ groups }: AppSidebarProps) {
  return (
    <Sidebar>
      {/* HEADER con logo */}
      <SidebarHeader>
        <div className="flex items-center justify-center p-2 mt-3">
          <img
            src={logo}
            alt="Logo"
            className="rounded-full w-[70px] h-[70px] my-[2px]"
          />
        </div>
      </SidebarHeader>

      {/* CONTENT con grupos */}
      <SidebarContent>
        {groups.map((group, idx) => (
          <SidebarGroup key={idx}>
            {group.title && (
              <div className="px-4 py-2 text-sm font-semibold text-gray-500">
                {group.title}
              </div>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="w-full p-2" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* FOOTER con dropdown */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <SidebarMenuButton className="w-full">
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </div>
              </DropdownMenuTrigger>


              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
