import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { SiteHeader, SiteHeaderProps } from "./SiteHeader"
import { AppSidebar, AppSidebarProps } from "./AppSidebar"

export type DashboardLayoutProps = {
  children: React.ReactNode
  sidebarProps?: Omit<AppSidebarProps, "children">
  headerProps?: SiteHeaderProps
  defaultOpen?: boolean
  showOverlay?: boolean
  overlayComponent?: React.ReactNode
}

export function DashboardLayout({
  children,
  sidebarProps,
  headerProps,
  defaultOpen = true,
  showOverlay = false,
  overlayComponent,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      <main className="relative flex-1 overflow-y-auto bg-background focus:outline-none">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar variant="inset" {...sidebarProps} />
          <SidebarInset>
            <SiteHeader {...headerProps} />
            <div className="flex flex-1 flex-col shadow-lg">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                  {showOverlay && overlayComponent}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  )
}
