import { useAuth } from '../../../providers/AuthProvider';
import { createAxiosInstance } from './axios';

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  [key: string]: any;
}

export interface UseRefreshTokenOptions {
  refreshUrl?: string;
  onSuccess?: (tokens: RefreshTokenResponse) => void;
  onError?: (error: any) => void;
}

/**
 * Hook to refresh authentication tokens
 * 
 * @param options - Configuration options
 * @returns Function to refresh tokens
 * 
 * @example
 * ```tsx
 * import { useRefreshToken } from 'izen-react-starter';
 * 
 * function MyComponent() {
 *   const refresh = useRefreshToken({
 *     refreshUrl: '/auth/refresh',
 *     onSuccess: (tokens) => console.log('Tokens refreshed'),
 *     onError: (error) => console.error('Refresh failed', error)
 *   });
 *   
 *   const handleRefresh = async () => {
 *     const newTokens = await refresh();
 *     if (newTokens) {
 *       console.log('Got new tokens:', newTokens);
 *     }
 *   };
 * }
 * ```
 */
export default function useRefreshToken(
  options: UseRefreshTokenOptions = {}
): () => Promise<null | RefreshTokenResponse> {
  const { user, tokens, setAuthData } = useAuth();
  const { refreshUrl = '/auth/refresh', onSuccess, onError } = options;

  const refresh = async (): Promise<null | RefreshTokenResponse> => {
    try {
      // Create a basic axios instance for refresh (to avoid circular dependencies)
      const axios = createAxiosInstance({
        baseURL: '', // Should be set by the consuming app
      });

      const response = await axios.post<RefreshTokenResponse>(
        refreshUrl,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${tokens?.refresh_token}`,
          },
        }
      );

      if (response.data.access_token) {
        setAuthData(user, response.data);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        return response.data;
      }
      
      return null;
    } catch (err) {
      if (onError) {
        onError(err);
      }
      return null;
    }
  };

  return refresh;
}
