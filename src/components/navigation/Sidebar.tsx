import { DashboardNav, NavItem } from './DashboardNav';
import { Link } from 'react-router-dom';

export type SidebarProps = {
  navItems: NavItem[];
  logoText?: string;
  logoHref?: string;
};

export const Sidebar = ({
  navItems,
  logoText = 'Logo',
  logoHref = '/'
}: SidebarProps) => {
  return (
    <aside className="hidden h-screen w-64 flex-col overflow-y-auto overflow-x-hidden rounded-tr-[90px] border-r bg-primary py-8 pl-5 dark:bg-background lg:flex">
      <Link to={logoHref} className="text-3xl font-bold text-white">
        {logoText}
      </Link>
      <div className="mt-6 flex flex-1 flex-col justify-between">
        <DashboardNav items={navItems} />
      </div>
    </aside>
  );
};
