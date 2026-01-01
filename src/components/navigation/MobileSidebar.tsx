import { DashboardNav, NavItem } from './DashboardNav';
import { Sheet, SheetContent } from '../ui/sheet';
import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

export type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
  navItems: NavItem[];
  logoText?: string;
  logoHref?: string;
};

export const MobileSidebar = ({
  setSidebarOpen,
  sidebarOpen,
  navItems,
  logoText = 'Logo',
  logoHref = '/'
}: TMobileSidebarProps) => {
  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="bg-background !px-0">
          <div className="space-y-4 py-4">
            <div className="space-y-4 px-3 py-2">
              <Link to={logoHref} className="py-2 text-2xl font-bold text-white ">
                {logoText}
              </Link>
              <div className="space-y-1 px-2">
                <DashboardNav items={navItems} setOpen={setSidebarOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
