# izen-react-starter

A modern React component library built with Vite, TypeScript, and best practices.

## Changelog

- 2026-01-02: `BrowserRouter` removed from inside `AppProvider`. Consumers must wrap `AppProvider` (and any `react-router-dom` usage) in their own router at the app root.

## Features

- 🎨 **UI Components**: Pre-built, customizable components (Button, Card, etc.)
- 🎭 **Layout Context**: Context API for managing layout state (sidebar, theme)
- 🔐 **Authentication Provider**: Built-in auth context with cookie management
- 🛣️ **Routing Utilities**: Protected routes and navigation hooks
- 🎨 **Theme Provider**: Dark/light mode with system preference support
- 🌐 **API Service**: Axios-based service for data fetching and posting
- 🔄 **React Query Integration**: Built-in query client and provider with automatic cache management
- 🔐 **RBAC System**: Fully configurable role-based access control - bring your own roles and resources
- 🚀 **API Utilities**: Generic axios configuration, interceptors, queries, and mutations with TypeScript support
- 🎣 **Custom Hooks**: Utility hooks like useIsMobile, useRouter, usePathname
- 🛠️ **Utility Functions**: Helper functions for common tasks (cn, debounce, throttle, etc.)
- 💾 **Cache Utilities**: React Query cache manipulation helpers
- �📦 **TypeScript**: Full type safety and IntelliSense support
- ⚡ **Vite**: Lightning-fast development and optimized builds
- 🌳 **Tree-shakeable**: Optimized for minimal bundle size

## Installation

```bash
npm install izen-react-starter
# or
yarn add izen-react-starter
# or
pnpm add izen-react-starter
```

> **Note**: This library has a peer dependency of React ^18.2.0. If you're using React 19, you may need to install with `--legacy-peer-deps` flag:
> ```bash
> npm install izen-react-starter --legacy-peer-deps
> ```

### Import Styles

Don't forget to import the CSS file in your app entry point:

```tsx
// In your main.tsx or App.tsx
import 'izen-react-starter/style.css';
```

The library includes Tailwind CSS with pre-configured theme variables for:
- Light/Dark modes
- Customizable color schemes
- Geist font family
- Custom CSS variables for theming

## Usage

### App Provider (All-in-one)

Wrap your application with `BrowserRouter` at the root. `AppProvider` no longer creates a router internally so you control the router setup in your app entry point:

```tsx
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from 'izen-react-starter';
import { AppRouter } from './routes';

function App() {
  return (
    <BrowserRouter>
      <AppProvider 
        defaultTheme="light"
        showReactQueryDevtools={true}
      >
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}
```

> Recent change: `BrowserRouter` was removed from inside `AppProvider`. Always wrap `AppProvider` (or any components using `react-router-dom` hooks/components) in your own router at the application root.

### Authentication

```tsx
import { AuthProvider, useAuth } from 'izen-react-starter';

function LoginPage() {
  const { setAuthData } = useAuth();
  
  const handleLogin = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const { user, tokens } = await response.json();
    
    // Store user and tokens in cookies
    setAuthData(user, tokens);
  };
  
  return <div>Login Form</div>;
}

function ProfilePage() {
  const { user, tokens } = useAuth();
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Token: {tokens?.access_token}</p>
    </div>
  );
}
```

#### Typing `useAuth`

`useAuth` is generic. Bring your own user shape for full IntelliSense:

```tsx
import { useAuth } from 'izen-react-starter';

type MyUser = {
  id: string;
  name: string;
  role: 'admin' | 'user';
};

const { user, setAuthData } = useAuth<MyUser>();
setAuthData({ id: '1', name: 'Ada', role: 'admin' }, { access_token: 'jwt' });
```

### Protected Routes

```tsx
import { RequiredAuth } from 'izen-react-starter';
import { Routes, Route } from 'react-router-dom';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route element={<RequiredAuth redirectTo="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
```

> Make sure these routes are rendered inside your app-level router (e.g., `BrowserRouter`) that wraps `AppProvider`, so `RequiredAuth` and router hooks have a valid router context.

### App Router Hook (Simplified Routing)

The `useAppRouter` hook simplifies route configuration by automatically handling:
- Dashboard layout wrapping
- Authentication protection
- Route structure management

```tsx
import { useAppRouter } from 'izen-react-starter';
import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';

// Define your dashboard child routes
const dashboardChildren = [
  { path: 'users', element: <UsersPage /> },
  { path: 'clients', element: <ClientsPage /> },
  { path: 'preferences', element: <PreferencesPage /> },
];

// Define your public routes
const publicRoutes = [
  { path: '/', element: <HomePage />, index: true },
  { path: '/login', element: <LoginPage /> },
  { path: '/404', element: <NotFoundPage /> }
];

export default function AppRouter() {
  const routes = useAppRouter({
    DashboardLayout,
    dashboardChildren,
    publicRoutes,
    includeDefaultNotFound: true // adds default 404 if not provided
  });

  return routes;
}
```

The hook automatically:
- Wraps dashboard routes with `RequiredAuth` 
- Applies `DashboardLayout` wrapper
- Merges with public routes
- Handles 404 fallback

### Router Hooks

```tsx
import { useRouter, usePathname } from 'izen-react-starter';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <div>
      <p>Current path: {pathname}</p>
      <button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </button>
      <button onClick={() => router.back()}>
        Go Back
      </button>
    </div>
  );
}
```

### Theme Provider

```tsx
import { ThemeProvider, useTheme } from 'izen-react-starter';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### Modal and Overlay

```tsx
import { ModalProvider, useModal, OverlayProvider, useOverlay } from 'izen-react-starter';

function MyComponent() {
  const { isOpen, setIsOpen } = useModal();
  const { showOverlay, setShowOverlay } = useOverlay();
  
  return (
    <div>
      <button onClick={() => setIsOpen('my-modal')}>Open Modal</button>
      {isOpen === 'my-modal' && <div>Modal Content</div>}
    </div>
  );
}
```

### Components

```tsx
import { Button, Card } from 'izen-react-starter';

function MyApp() {
  return (
    <Card 
      title="Hello World" 
      elevation="medium"
      style={{ marginBottom: '2rem' }}
      className="custom-card"
    >
      <p>Card content goes here</p>
      <Button variant="primary" size="medium" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
      <Button variant="secondary" size="small">
        Small Button
      </Button>
      <Button variant="outline" loading>
        Loading...
      </Button>
    </Card>
  );
}
```

### Generic Table

```tsx
import { GenericTable, ActionType } from 'izen-react-starter';

type SpecialDay = {
  id: number;
  name: string;
  start: string;
  end: string;
  floatingHoliday?: boolean;
};

function SpecialDaysView({ rows, pagination, onAction }: { rows: SpecialDay[]; pagination: any; onAction: (row: SpecialDay, action: ActionType) => void }) {
  return (
    <GenericTable
      rows={rows}
      columns={[
        { header: 'Name', render: (row) => `${row.name}${row.floatingHoliday ? ' (Floating Holiday)' : ''}` },
        { header: 'Start', render: (row) => new Date(row.start).toLocaleDateString() },
        { header: 'End', render: (row) => new Date(row.end).toLocaleDateString() },
      ]}
      getRowId={(row) => row.id}
      onAction={(row, action) => onAction(row, action)}
      getActionLink={(row) => `/preferences/special-days/${row.id}`}
      pagination={pagination}
      emptyText="No special days found."
    />
  );
}
```

### Table Utilities

```tsx
import { TableActions, Pagination, TableHeader, GenericTab } from 'izen-react-starter';

// Actions cell example
<TableActions
  link="/resource/123"
  Item={{ id: 123 }}
  handleAction={(row, action) => console.log(row, action)}
/>;

// Pagination example (expects meta/links/url shape)
<Pagination
  meta={{ currentPage: 1, itemsPerPage: 10, totalItems: 42 }}
  links={{ prev: null, next: '?page=2', first: '?page=1', last: '?page=5' }}
  url="/api/resources"
/>;

// Table header helper (basic)
<table>
  <TableHeader headers={["Name", "Email"]} />
  {/* ...rows */}
</table>;

// GenericTab helper to wrap tab content and reuse TableActions
<GenericTab
  key="notes"
  data={[{ id: 1, text: 'Note text' }]}
  handleAction={(item, action) => console.log(item, action)}
/>;
```

### Layout System

The library provides a complete layout system with sidebar, header, and navigation components.

#### DashboardLayout (Complete Layout)

A full dashboard layout that combines sidebar and header:

```tsx
import { DashboardLayout, Overlay } from 'izen-react-starter';
import { Home, Settings, FileText, HelpCircle } from 'lucide-react';

function App() {
  return (
    <DashboardLayout
      sidebarProps={{
        brandName: "My App",
        brandIcon: Home,
        navMain: [
          { title: "Dashboard", url: "/dashboard", icon: Home },
          { 
            title: "Settings", 
            url: "#",
            icon: Settings,
            items: [
              { title: "Profile", url: "/settings/profile" },
              { title: "Security", url: "/settings/security" },
            ]
          },
        ],
        navSecondary: [
          { title: "Help", url: "/help", icon: HelpCircle },
          { title: "Docs", url: "/docs", icon: FileText, target: "_blank" },
        ],
        user: {
          name: "John Doe",
          email: "john@example.com",
          avatar: "/avatar.jpg",
        },
        onLogout: () => console.log("Logout"),
        userMenuItems: [
          { label: "Profile", onClick: () => {} },
          { label: "Settings", onClick: () => {} },
        ],
      }}
      headerProps={{
        pageTitles: {
          "/dashboard": "Dashboard",
          "/settings": "Settings",
        },
        defaultTitle: "My App",
      }}
      defaultOpen={true}
      showOverlay={false}
      overlayComponent={<Overlay show={false} />}
    >
      {/* Your page content */}
    </DashboardLayout>
  );
}
```

#### AppSidebar (Sidebar Component)

Collapsible sidebar with navigation menu:

```tsx
import { AppSidebar } from 'izen-react-starter';
import { Home, Settings, Users } from 'lucide-react';

<AppSidebar
  brandName="Acme Inc"
  brandIcon={Home}
  navMain={[
    { title: "Home", url: "/", icon: Home, badge: "3" },
    { 
      title: "Settings", 
      url: "#",
      icon: Settings,
      items: [
        { title: "Profile", url: "/settings/profile" },
        { title: "Security", url: "/settings/security" },
      ]
    },
  ]}
  navSecondary={[
    { title: "Help", url: "/help", icon: HelpCircle },
  ]}
  user={{
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "/avatar.jpg",
  }}
  onLogout={() => console.log("Logging out")}
  userMenuItems={[
    { label: "Account", onClick: () => {} },
  ]}
/>
```

#### Navigation Components

**NavMain** - Main navigation menu with collapsible groups:

```tsx
import { NavMain } from 'izen-react-starter';
import { Home, Settings } from 'lucide-react';

<NavMain
  items={[
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { 
      title: "Settings",
      icon: Settings,
      items: [
        { title: "Profile", url: "/settings/profile" },
        { title: "Security", url: "/settings/security", badge: "2" },
      ]
    },
  ]}
/>
```

**NavSecondary** - Secondary navigation links:

```tsx
import { NavSecondary } from 'izen-react-starter';
import { HelpCircle, FileText } from 'lucide-react';

<NavSecondary
  items={[
    { title: "Help", url: "/help", icon: HelpCircle },
    { title: "Documentation", url: "https://docs.example.com", icon: FileText, target: "_blank" },
  ]}
/>
```

**NavUser** - User menu dropdown:

```tsx
import { NavUser } from 'izen-react-starter';

<NavUser
  user={{
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatar.jpg",
  }}
  onLogout={() => console.log("Logout")}
  menuItems={[
    { label: "Profile", onClick: () => {} },
    { label: "Settings", onClick: () => {} },
  ]}
/>
```

**NavDocuments** - Document list with actions:

```tsx
import { NavDocuments } from 'izen-react-starter';
import { FileText } from 'lucide-react';

<NavDocuments
  items={[
    { name: "Report Q1", url: "/docs/q1", icon: FileText },
    { name: "Budget 2024", url: "/docs/budget", icon: FileText },
  ]}
/>
```

#### SiteHeader

Header with page title and sidebar trigger:

```tsx
import { SiteHeader } from 'izen-react-starter';

<SiteHeader
  pageTitles={{
    "/dashboard": "Dashboard",
    "/settings": "Settings",
  }}
  defaultTitle="My App"
/>
```

### Charts and Overlay

```tsx
import { ChartAreaInteractive, Overlay } from 'izen-react-starter';

// Chart with timeframe controls
<ChartAreaInteractive />;

// Simple overlay toggled by boolean
<Overlay show={isLoading} />;
```

### Layout Context

```tsx
import { LayoutProvider, useLayout } from 'izen-react-starter';

function App() {
  return (
    <LayoutProvider initialTheme="light" initialSidebarOpen={true}>
      <MyComponent />
    </LayoutProvider>
  );
}

function MyComponent() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useLayout();
  
  return (
    <div>
      <button onClick={toggleTheme}>
        Current theme: {theme}
      </button>
      <button onClick={toggleSidebar}>
        Sidebar is {sidebarOpen ? 'open' : 'closed'}
      </button>
    </div>
  );
}
```

### API Service

```tsx
import React, { useEffect } from 'react';
import { useApiService } from 'izen-react-starter';

// Set the base URL once, typically in your app root
export function App() {
  const apiService = useApiService();

  useEffect(() => {
    apiService.setBaseURL('https://api.example.com');
  }, [apiService]);

  return <UsersPage />;
}

// Usage in a page/component
export function UsersPage() {
  const apiService = useApiService();

  // Fetch users example
  const fetchUsers = async () => {
    try {
      const users = await apiService.get('/users');
      console.log(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Create user example
  const createUser = async () => {
    try {
      const response = await apiService.post('/users', {
        name: 'John Doe',
        email: 'john@example.com',
      });
      console.log(response);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchUsers}>Fetch Users</button>
      <button onClick={createUser}>Create User</button>
    </div>
  );
}
```
> **Tip:** You only need to set the baseURL once per app session. After that, all requests will use this base URL automatically. The token will always be injected from AuthProvider for every request.

### Role-Based Access Control (RBAC)

The RBAC system is now fully configurable! Define your own roles, resources, and rules.

```tsx
import { 
  RBACProvider,
  useAccessControl, 
  AccessControlWrapper, 
  withAccessControl,
  CommonActions,
  RBACConfig 
} from 'izen-react-starter';

// 1. Define your RBAC configuration
const rbacConfig: RBACConfig = {
  roles: ['admin', 'editor', 'viewer'],
  resources: ['posts', 'comments', 'users'],
  rules: {
    admin: {
      [CommonActions.Manage]: { can: 'all' },
      [CommonActions.Create]: { can: 'all' },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { can: 'all' },
      [CommonActions.Delete]: { can: 'all' },
    },
    editor: {
      [CommonActions.Create]: { can: ['posts', 'comments'] },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { can: ['posts', 'comments'] },
      [CommonActions.Delete]: { can: ['comments'] },
    },
    viewer: {
      [CommonActions.Read]: { can: 'all' },
    },
  },
};

// 2. Wrap your app with RBACProvider
function App() {
  return (
    <AuthProvider>
      <RBACProvider config={rbacConfig}>
        <YourApp />
      </RBACProvider>
    </AuthProvider>
  );
}

// 3. Use access control in your components
function AdminPanel() {
  const { isAllowed } = useAccessControl();
  
  return (
    <div>
      {isAllowed('create', 'users') && (
        <button>Create User</button>
      )}
      {isAllowed('delete', 'users') && (
        <button>Delete User</button>
      )}
    </div>
  );
}

// Using the wrapper component
function Dashboard() {
  return (
    <AccessControlWrapper resource="posts" action="create">
      <CreatePostButton />
    </AccessControlWrapper>
  );
}

// Using the HOC
const ProtectedComponent = withAccessControl(MyComponent);

<ProtectedComponent 
  accessedResource="users" 
  accessAction="update"
  otherProp="value" 
/>
```

> 📖 **See [RBAC.md](./RBAC.md) for comprehensive documentation** including custom actions, multiple roles, migration guide, and advanced examples.
```

### Utility Functions

```tsx
import { cn, debounce, throttle, capitalize, formatDate } from 'izen-react-starter';

// Combine classnames with Tailwind merge
const className = cn('bg-blue-500', 'text-white', 'hover:bg-blue-600');

// Debounce function calls
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

// Throttle function calls
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

// Capitalize strings
const capitalized = capitalize('hello'); // 'Hello'

// Format dates
const formatted = formatDate(new Date(), 'yyyy-MM-dd');
```

### Custom Hooks

```tsx
import { useIsMobile } from 'izen-react-starter';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### Cache Management

```tsx
import { handleEditCache, handleSingleEditCache } from 'izen-react-starter';

// Update cache after editing an item
handleEditCache({
  item: updatedUser,
  type: 'edit',
  cacheKey: 'users'
});

// Add new item to cache
handleEditCache({
  item: newUser,
  type: 'add',
  cacheKey: 'users'
});

// Delete item from cache
handleEditCache({
  item: { id: userId },
  type: 'delete',
  cacheKey: 'users'
});
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build

# Lint code
npm run lint
```

### Project Structure

```
src/
├── components/          # UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.css
│   │   └── index.ts
│   └── Card/
│       ├── Card.tsx
│       ├── Card.css
│       └── index.ts
├── contexts/           # React contexts
│   └── LayoutContext.tsx
├── hooks/              # Custom hooks
│   ├── useIsMobile.ts
│   └── index.ts
├── lib/                # Utility functions
│   ├── utils.ts
│   ├── cache-util.ts
│   └── index.ts
├── providers/          # Context providers
│   ├── AuthProvider.tsx
│   ├── ModalProvider.tsx
│   ├── OverlayProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── AppProvider.tsx
│   └── index.ts
├── rbac/               # Role-based access control
│   ├── access-rules.ts
│   ├── useAccessControl.ts
│   ├── AccessControlWrapper.tsx
│   ├── UpdateAccessControlWrapper.tsx
│   └── index.ts
├── routes/             # Routing utilities
│   ├── RequiredAuth.tsx
│   ├── hooks/
│   │   ├── usePathname.ts
│   │   ├── useRouter.ts
│   │   └── index.ts
│   └── index.ts
│   └── index.ts
├── services/           # API and utility services
│   └── apiService.ts
├── index.ts           # Main export file
└── main.tsx           # Dev preview entry
```

## API Documentation

### AppProvider

A comprehensive provider that wraps your app with all necessary providers.

Props:
- `children`: ReactNode (required)
- `ErrorFallback`: React.ComponentType<FallbackProps> (optional)
- `showReactQueryDevtools`: boolean (default: false)
- `defaultTheme`: 'dark' | 'light' | 'system' (default: 'light')
- `storageKey`: string (default: 'vite-ui-theme')

### AuthProvider

Authentication context provider with cookie-based storage.

Hooks:
- `useAuth()`: Returns auth context with user, tokens, and management methods

Context value:
- `user`: User | undefined
- `tokens`: BackendTokens | undefined
- `setAuthData(user, tokens)`: Store auth data in cookies
- `otherData`: any (for additional app data)
- `setOtherData(data)`: Set additional data

### RequiredAuth

Protected route component that redirects unauthenticated users.

Props:
- `redirectTo`: string (default: '/login') - Where to redirect if not authenticated

### Router Hooks

**useRouter()**
- `back()`: Navigate back
- `forward()`: Navigate forward
- `reload()`: Reload page
- `push(href)`: Navigate to route
- `replace(href)`: Replace current route

**usePathname()**
- Returns current pathname string

### ThemeProvider

Theme management with localStorage persistence.

Props:
- `children`: ReactNode
- `defaultTheme`: 'dark' | 'light' | 'system' (default: 'light')
- `storageKey`: string (default: 'vite-ui-theme')

Hook:
- `useTheme()`: Returns { theme, setTheme }

### ModalProvider

Modal state management.

Hook:
- `useModal()`: Returns { isOpen, setIsOpen }

### OverlayProvider

Overlay state management.

Hook:
- `useOverlay()`: Returns { showOverlay, setShowOverlay }

### Button Component

Props:
- `variant`: 'primary' | 'secondary' | 'outline' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `loading`: boolean (default: false)
- All standard HTML button attributes

### Card Component

Props:
- `title`: string (optional) - Card header title
- `children`: ReactNode (required) - Card body content
- `footer`: ReactNode (optional) - Card footer content
- `elevation`: 'none' | 'low' | 'medium' | 'high' (default: 'medium') - Shadow depth
- `className`: string (optional) - Additional CSS classes
- `style`: CSSProperties (optional) - Inline styles
- All standard HTML div attributes (onClick, onMouseEnter, etc.)

### Layout Context

Context value:
- `sidebarOpen`: boolean
- `toggleSidebar`: () => void
- `setSidebarOpen`: (open: boolean) => void
- `theme`: 'light' | 'dark'
- `toggleTheme`: () => void
- `setTheme`: (theme: 'light' | 'dark') => void

### API Service

Methods:
- `get<T>(url, config?)`: Promise<T>
- `post<T>(url, data?, config?)`: Promise<T>
- `put<T>(url, data?, config?)`: Promise<T>
- `patch<T>(url, data?, config?)`: Promise<T>
- `delete<T>(url, config?)`: Promise<T>
- `setBaseURL(baseURL)`: void

> **Note:** The API service now always uses the latest token from the AuthProvider. Use the `useApiService` hook in your components. You no longer need to call `setAuthToken` or `removeAuthToken` manually.
### Organized Component Library

The library includes a comprehensive set of components organized by functionality:

#### Modals

Reusable modal dialogs for common user interactions.

```tsx
import { AlertModal, DeleteDialog, PopupModal } from 'izen-react-starter';

// Alert Modal - Generic confirmation dialog
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AlertModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={handleConfirm}
      loading={loading}
      title="Are you sure?"
      description="This action cannot be undone."
    />
  );
}

// Delete Dialog - Specific delete confirmation
<DeleteDialog
  openDeleteDialog={isDeleteOpen}
  setIsOpenDeleteDialog={setIsDeleteOpen}
  onDelete={handleDelete}
/>

// Popup Modal - Complex modal with scroll area and optional "Add New" button
<PopupModal
  isOpen={modalName === 'create'}
  setIsOpen={setModalName}
  modalName="create"
  title="Add New Item"
  showAddBtn={true}
  isAllowedCreate={true}
  renderModal={(onClose) => (
    <YourForm 
      onSubmit={(data) => {
        handleSubmit(data);
        onClose();
      }}
    />
  )}
  extraBtns={() => (
    <Button onClick={handleExtraAction}>Custom Action</Button>
  )}
/>
```

#### Navigation Components

Complete navigation system with responsive design.

```tsx
import { UserNav, DashboardNav, Sidebar, MobileSidebar, Header } from 'izen-react-starter';

// User navigation dropdown with avatar
<UserNav
  user={{ 
    name: 'John Doe', 
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  }}
  onLogout={handleLogout}
/>

// Dashboard navigation list with icons
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'home', isShow: true },
  { href: '/settings', label: 'Settings', icon: 'settings', isShow: true },
  { href: '/users', label: 'Users', icon: 'users', isShow: false } // Hidden item
];

<DashboardNav
  items={navItems}
  setOpen={setIsSidebarOpen} // Optional - for mobile
/>

// Desktop sidebar with branding
<Sidebar
  navItems={navItems}
  logoText="My App"
  logoHref="/"
/>

// Mobile sidebar with sheet overlay
<MobileSidebar
  sidebarOpen={isMobileOpen}
  setSidebarOpen={setIsMobileOpen}
  navItems={navItems}
  logoText="My App"
  logoHref="/"
/>

// Complete header with user nav and theme toggle
<Header
  title="My Application"
  user={{ name: 'John Doe', email: 'john@example.com' }}
  onLogout={handleLogout}
  setTheme={setTheme}
  extraContent={
    <Button>Custom Button</Button>
  }
/>
```

#### Date Picker Components

Date selection and filtering with URL parameter integration.

```tsx
import { DatePickerWithRange, DateRangeFilter } from 'izen-react-starter';

// Date range picker with calendar (3 months view)
<DatePickerWithRange
  startDate={new Date('2024-01-01')}
  endDate={new Date('2024-01-31')}
  onChange={(from, to) => {
    console.log('Selected range:', from, to);
    // Update your state or make API calls
  }}
  className="my-custom-class"
/>

// Date range filter with URL params (great for tables/reports)
// Automatically syncs with URL query parameters
<DateRangeFilter
  startDateParamName="startDate"  // URL param name, defaults to 'filterStartDate'
  endDateParamName="endDate"      // URL param name, defaults to 'filterEndDate'
  className="mb-4"
/>
// URL will be updated to: ?startDate=2024-01-01&endDate=2024-01-31
// Default range: 2 days ago to 3 days ahead
```

#### Search Components

Search input with debouncing and URL parameter integration.

```tsx
import { TableSearchInput } from 'izen-react-starter';

// Debounced search input (1 second delay)
// Automatically updates URL search params
<TableSearchInput 
  placeholder="Search users..." 
/>
// Updates URL to: ?search=query&page=1
// Integrates with react-router-dom's useSearchParams
```

#### Common UI Components

Basic UI building blocks used across the application.

```tsx
import { Heading, PageHead, ThemeToggle, Header } from 'izen-react-starter';

// Page heading with optional description
<Heading 
  title="Dashboard" 
  description="Welcome to your dashboard"
  className="mb-4"
/>

// Document head/title (uses react-helmet-async)
<PageHead title="Dashboard | My App" />

// Theme toggle dropdown (light/dark/pink/system)
<ThemeToggle setTheme={(theme) => {
  // theme: 'light' | 'dark' | 'pink' | 'system'
  console.log('Theme changed to:', theme);
}} />
```

#### Enhanced Table Components

Advanced table utilities with server-side features.

```tsx
import { 
  DataTableSkeleton, 
  PaginationSection, 
  ServerDataTable,
  TableSearchInput 
} from 'izen-react-starter';

// Loading skeleton while data is fetching
<DataTableSkeleton
  columnCount={5}
  rowCount={10}
  searchableColumnCount={1}
  filterableColumnCount={2}
  showViewOptions={true}
/>

// Client-side pagination component
<PaginationSection
  totalPosts={100}
  postsPerPage={10}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
/>

// Server-side data table with TanStack Table
// Automatically syncs with URL params (?page=1&limit=10)
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

<ServerDataTable
  columns={columns}
  data={users}
  pageCount={totalPages}
  pageSizeOptions={[10, 20, 50, 100]}
/>
// Features:
// - Automatic URL sync (?page=2&limit=20)
// - Server-side pagination
// - Row selection
// - Sorting support
// - Custom page size options
```

**Complete Table Example with Search and Filters:**

```tsx
import { 
  ServerDataTable, 
  TableSearchInput, 
  DateRangeFilter,
  DataTableSkeleton 
} from 'izen-react-starter';

function UsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['users', searchParams.toString()],
    queryFn: () => fetchUsers(searchParams)
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={4} />;
  }

  return (
    <div>
      {/* Search and filters */}
      <div className="flex gap-4 mb-4">
        <TableSearchInput placeholder="Search users..." />
        <DateRangeFilter />
      </div>
      
      {/* Data table */}
      <ServerDataTable
        columns={columns}
        data={data.users}
        pageCount={data.totalPages}
      />
    </div>
  );
}
```

### Form Components

The library provides a complete set of form components that are library-ready without tight coupling to app-specific contexts.

#### FileUploadButton

Flexible file upload button with validation:

```tsx
import { FileUploadButton } from 'izen-react-starter';

<FileUploadButton
  title="Upload File"
  name="document"
  accept={{
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg']
  }}
  maxSize={5 * 1024 * 1024} // 5MB
  disabled={false}
  onValidationError={(error) => {
    console.error('Validation error:', error);
    // Show toast or alert
  }}
  onSuccess={(file) => {
    console.log('File uploaded:', file);
    // Handle file upload
  }}
  className="my-4"
/>
```

#### DatePicker

Calendar-based date picker with popover:

```tsx
import { DatePicker } from 'izen-react-starter';

<DatePicker
  title="Select Date"
  name="eventDate"
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  placeholder="Pick a date"
  error={errors.eventDate}
  disabled={false}
/>
```

#### TimeInput

Time input with hours, minutes, and optional seconds:

```tsx
import { TimeInput } from 'izen-react-starter';

<TimeInput
  title="Event Time"
  name="startTime"
  value="14:30"
  onChange={(time) => console.log('Time:', time)}
  showSeconds={false}
  error={errors.startTime}
  disabled={false}
/>
```

#### TextInput

Versatile text input supporting multiple types and textarea:

```tsx
import { TextInput } from 'izen-react-starter';
import { Mail, Lock } from 'lucide-react';

// Text input with icon
<TextInput
  title="Email"
  name="email"
  type="email"
  icon={<Mail />}
  placeholder="Enter your email"
  error={errors.email}
/>

// Password input
<TextInput
  title="Password"
  name="password"
  type="password"
  icon={<Lock />}
  placeholder="Enter password"
  error={errors.password}
/>

// Textarea
<TextInput
  title="Description"
  name="description"
  type="textarea"
  rows={5}
  placeholder="Enter description"
  error={errors.description}
/>

// Number input
<TextInput
  title="Age"
  name="age"
  type="number"
  min={0}
  max={120}
  placeholder="Enter age"
/>
```

#### CheckboxGroup

Checkbox input supporting single or multiple items:

```tsx
import { CheckboxGroup } from 'izen-react-starter';

// Single checkbox
<CheckboxGroup
  title="Accept Terms"
  name="terms"
  items={[
    { id: 'terms', name: 'terms', displayName: 'I accept the terms and conditions' }
  ]}
  error={errors.terms}
/>

// Multiple checkboxes
<CheckboxGroup
  title="Select Features"
  name="features"
  items={[
    { id: 'feature1', name: 'features', displayName: 'Email Notifications', checked: true },
    { id: 'feature2', name: 'features', displayName: 'SMS Alerts', checked: false },
    { id: 'feature3', name: 'features', displayName: 'Push Notifications', checked: true },
  ]}
  onChange={(e) => {
    const checked = e.target.checked;
    const id = e.target.id;
    console.log(`Checkbox ${id} is ${checked ? 'checked' : 'unchecked'}`);
  }}
/>
```

#### RadioGroup

Radio button group with horizontal or vertical layout:

```tsx
import { RadioGroup } from 'izen-react-starter';

// Horizontal layout
<RadioGroup
  title="Select Plan"
  name="plan"
  items={[
    { value: 'free', title: 'Free Plan' },
    { value: 'pro', title: 'Pro Plan' },
    { value: 'enterprise', title: 'Enterprise Plan' },
  ]}
  onChange={(e) => console.log('Selected:', e.target.value)}
  error={errors.plan}
/>

// Vertical layout
<RadioGroup
  title="Notification Preference"
  name="notifications"
  vertical={true}
  items={[
    { value: 'all', title: 'All Notifications' },
    { value: 'important', title: 'Important Only' },
    { value: 'none', title: 'None' },
  ]}
  onChange={(e) => setNotificationPref(e.target.value)}
/>
```

**Complete Form Example:**

```tsx
import { 
  TextInput, 
  DatePicker, 
  TimeInput, 
  CheckboxGroup,
  RadioGroup,
  FileUploadButton 
} from 'izen-react-starter';
import { useState } from 'react';

function EventForm() {
  const [formData, setFormData] = useState({
    name: '',
    date: undefined,
    time: '09:00',
    type: 'public',
    features: [],
    document: null
  });
  
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        title="Event Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter event name"
        error={errors.name}
      />
      
      <DatePicker
        title="Event Date"
        name="date"
        value={formData.date}
        onChange={(date) => setFormData({ ...formData, date })}
        error={errors.date}
      />
      
      <TimeInput
        title="Start Time"
        name="time"
        value={formData.time}
        onChange={(time) => setFormData({ ...formData, time })}
        error={errors.time}
      />
      
      <RadioGroup
        title="Event Type"
        name="type"
        items={[
          { value: 'public', title: 'Public Event' },
          { value: 'private', title: 'Private Event' },
        ]}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />
      
      <CheckboxGroup
        title="Event Features"
        name="features"
        items={[
          { id: 'catering', name: 'features', displayName: 'Catering' },
          { id: 'parking', name: 'features', displayName: 'Parking' },
          { id: 'wifi', name: 'features', displayName: 'WiFi' },
        ]}
      />
      
      <FileUploadButton
        title="Event Document"
        name="document"
        accept={{ 'application/pdf': ['.pdf'] }}
        onSuccess={(file) => setFormData({ ...formData, document: file })}
        onValidationError={(error) => setErrors({ ...errors, document: error })}
      />
      
      <button type="submit" className="btn btn-primary">
        Create Event
      </button>
    </form>
  );
}
```

#### FormInput

Enhanced input component with card number formatting and date display:

```tsx
import { FormInput } from 'izen-react-starter';
import { User, Mail, CreditCard } from 'lucide-react';

// Text input with icon
<FormInput
  title="Full Name"
  name="fullName"
  type="text"
  icon={<User />}
  placeholder="Enter your name"
  value={name}
  onValueChange={(value) => setName(value)}
  error={errors.name}
/>

// Card number with auto-formatting
<FormInput
  title="Card Number"
  name="cardNumber"
  type="cardNumber"
  icon={<CreditCard />}
  placeholder="0000 0000 0000 0000"
  value={cardNumber}
  onValueChange={(value) => setCardNumber(value)}
/>

// Date input with formatted label
<FormInput
  title="Birth Date"
  name="birthDate"
  type="date"
  value={birthDate}
  onChange={(e) => setBirthDate(e.target.value)}
  showDateLabel={true} // Shows formatted date like "(Jan 15)"
/>

// Textarea
<FormInput
  title="Comments"
  name="comments"
  type="textarea"
  rows={4}
  placeholder="Enter your comments"
  value={comments}
  onValueChange={(value) => setComments(value)}
/>
```

#### FormSelect

Standard dropdown select component:

> **Note:** This component is exported as `FormSelect` to avoid naming conflict with shadcn/ui's `Select` component.

```tsx
import { FormSelect } from 'izen-react-starter';

<FormSelect
  title="Country"
  name="country"
  placeholder="Select country"
  value={country}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ]}
  onChange={(value) => setCountry(value)}
  error={errors.country}
/>

// With "Please Select" option
<FormSelect
  title="Category"
  name="category"
  showOtherOption={true}
  otherOptionLabel="Please Select"
  options={categories}
  onChange={(value) => setCategory(value)}
/>
```

#### ComboboxSelect

Advanced searchable select with Command palette:

```tsx
import { ComboboxSelect } from 'izen-react-starter';
import { Building } from 'lucide-react';

<ComboboxSelect
  title="Company"
  name="company"
  icon={<Building />}
  placeholder="Search companies..."
  value={selectedCompany}
  options={companies}
  onChange={(value) => setSelectedCompany(value)}
  onSearch={(searchTerm) => {
    // Trigger API call to search companies
    fetchCompanies(searchTerm);
  }}
  showOtherOption={true}
  otherOptionLabel="No Company"
  emptyMessage="No companies found."
  error={errors.company}
/>
```

**Features:**
- Searchable with Command palette UI
- Toggle selection (click again to deselect)
- Optional "other" option
- Custom empty state message
- Search callback for dynamic loading

#### FormButtons

Reusable form action buttons:

```tsx
import { FormButtons } from 'izen-react-starter';

<FormButtons
  loading={isSubmitting}
  showSubmit={true}
  showCancel={true}
  showReset={true}
  submitText="Save"
  cancelText="Cancel"
  resetText="Clear"
  onCancel={() => router.back()}
  onReset={() => form.reset()}
  onSubmit={() => form.handleSubmit(onSubmit)()}
/>
```

**Props:**
- `loading`: Shows "Please wait..." text
- `showSubmit/showCancel/showReset`: Toggle button visibility
- `submitText/cancelText/resetText`: Custom button labels
- `onCancel/onReset/onSubmit`: Click handlers

#### FormLayout

Complete form wrapper with error display and action buttons:

```tsx
import { FormLayout, FormInput, FormSelect } from 'izen-react-starter';
import { useState } from 'react';

function CreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    
    try {
      await createUser(data);
      router.push('/users');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      showSubmit={true}
      showCancel={true}
      showReset={true}
      submitText="Create User"
      onCancel={() => router.back()}
      onReset={() => {
        // Reset form logic
      }}
      fullHeight={false}
    >
      <FormInput
        title="Name"
        name="name"
        placeholder="Enter name"
      />
      
      <FormInput
        title="Email"
        name="email"
        type="email"
        placeholder="Enter email"
      />
      
      <FormSelect
        title="Role"
        name="role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ]}
      />
    </FormLayout>
  );
}
```

**Features:**
- Automatic form submission handling
- Error display with Alert component
- Integrated FormButtons
- Card wrapper with styling
- Loading state management
- Sticky button footer

**Complete Advanced Form Example:**

```tsx
import {
  FormLayout,
  FormInput,
  Select,
  ComboboxSelect,
  DatePicker,
  TimeInput,
  CheckboxGroup,
  RadioGroup,
  FileUploadButton
} from 'izen-react-starter';
import { useState } from 'react';

function AdvancedForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    country: '',
    company: '',
    eventDate: undefined,
    startTime: '09:00',
    plan: 'free',
    features: [],
    document: null
  });

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Process form data
      await submitForm({ ...formData, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      submitText="Submit Registration"
      fullHeight={false}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          title="Full Name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
        />
        
        <FormInput
          title="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onValueChange={(value) => setFormData({ ...formData, email: value })}
        />
      </div>

      <FormInput
        title="Card Number"
        name="cardNumber"
        type="cardNumber"
        placeholder="0000 0000 0000 0000"
        value={formData.cardNumber}
        onValueChange={(value) => setFormData({ ...formData, cardNumber: value })}
      />

      <FormSelect
        title="Country"
        name="country"
        placeholder="Select country"
        value={formData.country}
        options={countries}
        onChange={(value) => setFormData({ ...formData, country: value })}
      />

      <ComboboxSelect
        title="Company"
        name="company"
        placeholder="Search companies..."
        value={formData.company}
        options={companies}
        onChange={(value) => setFormData({ ...formData, company: value })}
        onSearch={(term) => searchCompanies(term)}
      />

      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          title="Event Date"
          name="eventDate"
          value={formData.eventDate}
          onChange={(date) => setFormData({ ...formData, eventDate: date })}
        />
        
        <TimeInput
          title="Start Time"
          name="startTime"
          value={formData.startTime}
          onChange={(time) => setFormData({ ...formData, startTime: time })}
        />
      </div>

      <RadioGroup
        title="Subscription Plan"
        name="plan"
        items={[
          { value: 'free', title: 'Free' },
          { value: 'pro', title: 'Pro' },
          { value: 'enterprise', title: 'Enterprise' },
        ]}
        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
      />

      <CheckboxGroup
        title="Features"
        name="features"
        items={[
          { id: 'email', name: 'features', displayName: 'Email Notifications' },
          { id: 'sms', name: 'features', displayName: 'SMS Alerts' },
          { id: 'push', name: 'features', displayName: 'Push Notifications' },
        ]}
      />

      <FileUploadButton
        title="Upload Document"
        name="document"
        accept={{ 'application/pdf': ['.pdf'] }}
        maxSize={5 * 1024 * 1024}
        onSuccess={(file) => setFormData({ ...formData, document: file })}
      />
    </FormLayout>
  );
}
```

### RBAC System

**Enums:**
- `Action`: Manage, Create, Read, Update, Delete
- `Resource`: Users, UserGroups, Clients, Reports, etc.
- `Role`: Admin, Manager, Reader, Client

**Functions:**
- `userCan(roles, action, resource)`: Check if user can perform action
- `useAccessControl()`: Hook for access control
  - `isAllowed(action, resource)`: boolean
  - `getResourceByUrl(url)`: Resource

**Components:**
- `<AccessControlWrapper>`: Conditionally render based on permissions
- `withAccessControl(Component)`: HOC for access control
- `<UpdateAccessControlWrapper>`: Wrapper specifically for Update action

### Utility Functions

- `cn(...inputs)`: Merge Tailwind classes with clsx
- `capitalize(str)`: Capitalize first letter
- `convertToHourMinuteString(hours)`: Convert decimal hours to HH:MM
- `formatErrorToList(errors)`: Format errors as HTML list
- `formatDate(date, format)`: Format date strings
- `appendFormData(data)`: Convert object to FormData
- `debounce(func, wait)`: Debounce function calls
- `throttle(func, limit)`: Throttle function calls

### Cache Utilities

- `handleEditCache({ item, type, cacheKey })`: Manipulate React Query cache
  - type: 'edit' | 'add' | 'delete'
- `handleSingleEditCache({ item, cacheKey })`: Update single item in cache

### Custom Hooks

- `useIsMobile()`: Detect if viewport is mobile (<768px)
- `useRouter()`: Navigation utilities
- `usePathname()`: Get current pathname
- `useAccessControl()`: Access control utilities

## License

MIT
