import { useState } from "react"

export function useSidebar() {
  const [open, setOpen] = useState(true)
  const [openMobile, setOpenMobile] = useState(false)

  const toggleSidebar = () => setOpen(!open)
  const toggleSidebarMobile = () => setOpenMobile(!openMobile)

  return {
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    toggleSidebarMobile,
  }
}
