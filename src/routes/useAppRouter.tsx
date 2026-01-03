import { RouteObject, useRoutes, Outlet, useInRouterContext } from 'react-router-dom';
import { RequiredAuth } from './RequiredAuth';

export interface AppRouterConfig {
  /**
   * Dashboard child routes - these will be wrapped in RequiredAuth and DashboardLayout
   * Example: [{ path: 'users', element: <UsersPage /> }, ...]
   */
  dashboardChildren?: RouteObject[];

  /**
   * Custom DashboardLayout wrapper component
   * If provided, replaces the default layout
   */
  DashboardLayout?: React.ComponentType<{ children: React.ReactNode }>;

  /**
   * Public routes to merge (HomePage, LoginPage, 404, etc.)
   * These will be added as-is to the route config
   */
  publicRoutes?: RouteObject[];

  /**
   * Whether to include default 404 handling
   * @default true
   */
  includeDefaultNotFound?: boolean;
}

/**
 * Hook to build app routes with authentication and layout wrapping
 * 
 * Developers provide their dashboard children routes and public routes,
 * the hook handles RequiredAuth wrapping and DashboardLayout injection
 * 
 * @example
 * ```tsx
 * import { useAppRouter } from 'izen-react-starter';
 * import { Outlet, Suspense } from 'react';
 * import DashboardLayout from '@/components/layout/dashboard-layout';
 * 
 * export default function AppRouter() {
 *   const routes = useAppRouter({
 *     DashboardLayout,
 *     dashboardChildren: [
 *       { path: 'users', element: <UsersPage /> },
 *       { path: 'clients', element: <ClientsPage /> },
 *       { path: 'preferences', element: <PreferencesPage /> }
 *     ],
 *     publicRoutes: [
 *       { path: '/', element: <HomePage />, index: true },
 *       { path: '/login', element: <LoginPage /> },
 *       { path: '/404', element: <NotFoundPage /> }
 *     ]
 *   });
 * 
 *   return routes;
 * }
 * ```
 */
export function useAppRouter(config: AppRouterConfig) {
  const { 
    dashboardChildren = [],
    DashboardLayout,
    publicRoutes = [],
    includeDefaultNotFound = true
  } = config;
if (!useInRouterContext()) {
    throw new Error(
      'useAppRouter must be used inside a Router (BrowserRouter, MemoryRouter, etc.)'
    );
  }

  // dashboardChildren should be like:
// [
//   { path: 'users', element: <UsersPage /> },
//   { path: 'clients', element: <ClientsPage /> }
// ]
  // Build dashboard routes with RequiredAuth and DashboardLayout
 const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <RequiredAuth />,
    children: [
      {
        element: DashboardLayout ? (
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        ) : (
          <Outlet />
        ),
        children: dashboardChildren
      }
    ]
  }
];

  // Add default 404 route if requested and not already present
  let finalPublicRoutes = [...publicRoutes];
  const hasCatchAll = publicRoutes.some(route => route.path === '*');
  
  if (includeDefaultNotFound && !hasCatchAll) {
    finalPublicRoutes = [
      ...finalPublicRoutes,
      {
        path: '*',
        element: <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      }
    ];
  }

const routes = useRoutes([...finalPublicRoutes, ...dashboardRoutes]);
  return routes;
}
