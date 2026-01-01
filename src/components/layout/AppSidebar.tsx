import * as React from "react"
import { ArrowUpCircleIcon } from "lucide-react"

import { NavSecondary, NavSecondaryItem } from "./NavSecondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { NavMain, NavMainItem } from "./NavMain"
import { NavUser, NavUserData } from "./NavUser"

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  navMain?: NavMainItem[]
  navSecondary?: NavSecondaryItem[]
  user?: NavUserData
  brandName?: string
  brandIcon?: React.ComponentType<{ className?: string }>
  onLogout?: () => void
  userMenuItems?: Array<{
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick?: () => void
  }>
}

export function AppSidebar({
  navMain = [],
  navSecondary = [],
  user,
  brandName = "ACS Tracking",
  brandIcon: BrandIcon = ArrowUpCircleIcon,
  onLogout,
  userMenuItems,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <BrandIcon className="h-5 w-5" />
                <span className="text-base font-semibold">{brandName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} onLogout={onLogout} menuItems={userMenuItems} />}</SidebarFooter>
    </Sidebar>
  )
}
