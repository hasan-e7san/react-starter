import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { OverlayProvider } from './OverlayProvider';
import { ModalProvider } from './ModalProvider';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000
    },
  },
});

export interface AppProviderProps {
  children: ReactNode;
  ErrorFallback?: React.ComponentType<FallbackProps>;
  showReactQueryDevtools?: boolean;
  defaultTheme?: 'dark' | 'light' | 'system';
  storageKey?: string;
}

const DefaultErrorFallback = ({ error }: FallbackProps) => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">
        Oops, something went wrong :(
      </h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
};

export function AppProvider({
  children,
  ErrorFallback = DefaultErrorFallback,
  showReactQueryDevtools = false,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme'
}: AppProviderProps) {
  return (
    <AuthProvider>
      <Suspense>
        <HelmetProvider>
          <BrowserRouter>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <QueryClientProvider client={queryClient}>
                {showReactQueryDevtools && <ReactQueryDevtools />}
                <OverlayProvider>
                  <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
                    <ModalProvider>
                      {children}
                    </ModalProvider>
                  </ThemeProvider>
                </OverlayProvider>
              </QueryClientProvider>
            </ErrorBoundary>
          </BrowserRouter>
        </HelmetProvider>
      </Suspense>
    </AuthProvider>
  );
}
