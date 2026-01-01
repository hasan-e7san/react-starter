import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export interface UseGetOptions {
  /**
   * Cache key for the query
   */
  queryKey?: string;
  /**
   * Query parameters
   */
  params?: Record<string, any>;
  /**
   * Override URL (if different from key)
   */
  url?: string;
  /**
   * Time in milliseconds until data is considered stale
   */
  staleTime?: number;
  /**
   * Enable refetch on window focus
   */
  refetchOnWindowFocus?: boolean;
  /**
   * Enable refetch on mount
   */
  refetchOnMount?: boolean;
  /**
   * Enable refetch on reconnect
   */
  refetchOnReconnect?: boolean;
  /**
   * Enable the query (useful for conditional queries)
   */
  enabled?: boolean;
}

/**
 * Generic hook to fetch multiple items
 * 
 * @param axios - Configured axios instance
 * @param key - Query key / API endpoint
 * @param options - Query configuration options
 * @returns React Query result object
 * 
 * @example
 * ```tsx
 * import { useGet } from 'izen-react-starter';
 * import useAxiosAuth from './hooks/useAxiosAuth';
 * 
 * function UsersList() {
 *   const axios = useAxiosAuth({ axiosInstance: myAxios });
 *   const { data, isLoading, error } = useGet(axios, '/users', {
 *     queryKey: 'users',
 *     params: { page: 1, limit: 10 }
 *   });
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <ul>
 *       {data?.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
const useGet = <T = any>(
  axios: AxiosInstance,
  key: string,
  options: UseGetOptions = {}
): UseQueryResult<T[], Error> => {
  const {
    queryKey,
    params,
    url,
    staleTime = 0,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    refetchOnReconnect = true,
    enabled = true,
  } = options;

  return useQuery<T[], Error>({
    queryKey: [queryKey || key, params || key, url || key],
    queryFn: async () => {
      const reqUrl = url || key;

      // Skip request if URL contains undefined or null
      if (reqUrl.includes('undefined') || reqUrl.includes('null')) {
        return [];
      }

      const response = await axios.get(reqUrl, {
        params,
      });

      return response.data?.data || response.data || [];
    },
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    enabled,
  });
};

/**
 * Generic hook to fetch a single item
 * 
 * @param axios - Configured axios instance
 * @param key - Query key / API endpoint
 * @param options - Query configuration options
 * @returns React Query result object with single item
 * 
 * @example
 * ```tsx
 * import { useGetSingle } from 'izen-react-starter';
 * import useAxiosAuth from './hooks/useAxiosAuth';
 * 
 * function UserDetail({ userId }) {
 *   const axios = useAxiosAuth({ axiosInstance: myAxios });
 *   const { data: user, isLoading, error } = useGetSingle(axios, `/users/${userId}`, {
 *     queryKey: `user-${userId}`,
 *     enabled: !!userId
 *   });
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return <div>{user?.name}</div>;
 * }
 * ```
 */
const useGetSingle = <T = any>(
  axios: AxiosInstance,
  key: string,
  options: UseGetOptions & { defaultValue?: T } = {}
): UseQueryResult<T, Error> => {
  const {
    queryKey,
    params,
    url,
    defaultValue,
    staleTime = 0,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    refetchOnReconnect = true,
    enabled = true,
  } = options;

  return useQuery<T, Error>({
    queryKey: [queryKey || key, params || key, url || key, JSON.stringify(params)],
    queryFn: async () => {
      const reqUrl = url || key;

      // Skip request if URL contains undefined or null
      if (reqUrl.includes('undefined') || reqUrl.includes('null')) {
        return defaultValue || ({} as T);
      }

      const response = await axios.get(reqUrl, {
        params,
      });

      return response.data?.data || response.data || defaultValue || ({} as T);
    },
    staleTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    enabled,
  });
};

export { useGet, useGetSingle };
