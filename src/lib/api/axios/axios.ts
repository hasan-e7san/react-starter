import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

/**
 * Configuration for creating axios instances
 */
export interface AxiosConfig extends CreateAxiosDefaults {
  baseURL: string;
  withCredentials?: boolean;
}

/**
 * Create a basic axios instance
 * 
 * @param config - Axios configuration
 * @returns Configured axios instance
 * 
 * @example
 * ```tsx
 * const api = createAxiosInstance({
 *   baseURL: 'https://api.example.com',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   }
 * });
 * ```
 */
export function createAxiosInstance(config: AxiosConfig): AxiosInstance {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...config,
  });
}

/**
 * Create an authenticated axios instance with cancel token
 * 
 * @param config - Axios configuration
 * @returns Configured axios instance with cancel token
 * 
 * @example
 * ```tsx
 * const authApi = createAuthAxiosInstance({
 *   baseURL: 'https://api.example.com',
 *   headers: {
 *     'Accept': 'application/json'
 *   }
 * });
 * ```
 */
export function createAuthAxiosInstance(config: AxiosConfig): AxiosInstance {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    cancelToken: new axios.CancelToken(() => {
      // Cancel function placeholder
    }),
    withCredentials: true,
    ...config,
  });
}

export default axios;
