import { Heading } from './Heading';
import { UserNav } from '../navigation/UserNav';
import { ThemeToggle } from './ThemeToggle';

export type HeaderProps = {
  title?: string;
  onLogout: () => void;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  setTheme: (theme: 'light' | 'dark' | 'pink' | 'system') => void;
  extraContent?: React.ReactNode;
};

export const Header = ({
  title = 'App Title',
  onLogout,
  user,
  setTheme,
  extraContent
}: HeaderProps) => {
  return (
    <div className="flex flex-1 items-center bg-secondary px-4">
      <Heading title={title} />
      <div className="ml-4 flex items-center md:ml-6">
        <UserNav user={user} onLogout={onLogout} />
        <ThemeToggle setTheme={setTheme} />
        {extraContent}
        <h2 className="text-xl font-bold tracking-tight text-primary sm:text-3xl sm:hidden">
          {title.substring(0, 3).toUpperCase()}
        </h2>
      </div>
    </div>
  );
};
