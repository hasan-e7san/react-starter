import { useAuth } from '../../../../providers/AuthProvider';
import useRefreshToken, { RefreshTokenResponse } from '../useRefreshToken';
import { useEffect, useState } from 'react';
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface UseAxiosAuthOptions {
  /**
   * The axios instance to configure with auth interceptors
   */
  axiosInstance: AxiosInstance;
  /**
   * URL for token refresh endpoint
   */
  refreshUrl?: string;
  /**
   * Custom headers to add to requests
   */
  customHeaders?: Record<string, string>;
  /**
   * Callback when token refresh fails
   */
  onRefreshFail?: () => void;
  /**
   * Callback when token is refreshed successfully
   */
  onRefreshSuccess?: (tokens: RefreshTokenResponse) => void;
}

/**
 * Hook to add authentication interceptors to axios instance
 * Automatically adds Authorization header and handles token refresh
 * 
 * @param options - Configuration options
 * @returns Axios instance with auth interceptors
 * 
 * @example
 * ```tsx
 * import { createAuthAxiosInstance, useAxiosAuth } from 'izen-react-starter';
 * 
 * const axiosAuth = createAuthAxiosInstance({
 *   baseURL: 'https://api.example.com'
 * });
 * 
 * function MyComponent() {
 *   const axios = useAxiosAuth({
 *     axiosInstance: axiosAuth,
 *     refreshUrl: '/auth/refresh',
 *     customHeaders: {
 *       'X-Custom-Header': 'value'
 *     },
 *     onRefreshFail: () => {
 *       window.location.href = '/login';
 *     }
 *   });
 *   
 *   const fetchData = async () => {
 *     const response = await axios.get('/api/data');
 *     return response.data;
 *   };
 * }
 * ```
 */
const useAxiosAuth = (options: UseAxiosAuthOptions): AxiosInstance => {
  const {
    axiosInstance,
    refreshUrl = '/auth/refresh',
    customHeaders = {},
    onRefreshFail,
    onRefreshSuccess,
  } = options;

  const refresh = useRefreshToken({
    refreshUrl,
    onSuccess: onRefreshSuccess,
  });

  const [sent, setSent] = useState<boolean>(false);
  const { tokens, setAuthData } = useAuth();

  useEffect(() => {
    // Request interceptor - add auth token to all requests
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${tokens?.access_token}`;
        }

        // Add custom headers
        Object.entries(customHeaders).forEach(([key, value]) => {
          config.headers[key] = value;
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 errors and refresh tokens
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (err: AxiosError) => {
        const prevRequest = err?.config;

        // If 401 and haven't tried refreshing yet
        if (err?.response?.status === 401 && !sent) {
          setSent(true);

          const newToken = await refresh();

          if (!newToken) {
            // Token refresh failed
            setAuthData(undefined, undefined);
            
            if (onRefreshFail) {
              onRefreshFail();
            } else {
              // Default behavior: redirect to login
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            }
            return Promise.reject(err);
          }

          // Retry the original request with new token
          if (prevRequest) {
            prevRequest.headers['Authorization'] = `Bearer ${newToken.access_token}`;
            
            // Re-add custom headers
            Object.entries(customHeaders).forEach(([key, value]) => {
              prevRequest.headers[key] = value;
            });

            return axiosInstance(prevRequest);
          }
        }

        return Promise.reject(err);
      }
    );

    // Cleanup interceptors
    return () => {
      axiosInstance.interceptors.response.eject(responseIntercept);
      axiosInstance.interceptors.request.eject(requestIntercept);
      setSent(false);
    };
  }, [tokens, refresh, customHeaders, sent]);

  return axiosInstance;
};

export default useAxiosAuth;
