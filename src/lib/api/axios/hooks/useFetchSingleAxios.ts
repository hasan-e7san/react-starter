import { useState, useEffect } from 'react';
import axios, { AxiosStatic, CancelToken, AxiosInstance } from 'axios';

export interface UseFetchSingleAxiosOptions {
  /**
   * API endpoint URL
   */
  url: string;
  /**
   * HTTP method to use
   */
  method: 'get' | 'post' | 'patch' | 'delete';
  /**
   * Base URL for API
   */
  baseURL: string;
  /**
   * Optional axios instance to use (defaults to axios)
   */
  axiosInstance?: AxiosInstance;
  /**
   * Optional authorization token
   */
  token?: string;
  /**
   * Custom headers
   */
  headers?: Record<string, string>;
}

export interface UseFetchSingleAxiosReturn<T = any> {
  data: T;
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
}

/**
 * Hook to fetch data from a single endpoint with cancel token support
 * 
 * @param options - Fetch configuration
 * @returns Object with data, loading, error, and errorMessage
 * 
 * @example
 * ```tsx
 * import { useFetchSingleAxios } from 'izen-react-starter';
 * 
 * function MyComponent() {
 *   const { data, loading, error, errorMessage } = useFetchSingleAxios({
 *     url: '/api/users/1',
 *     method: 'get',
 *     baseURL: 'https://api.example.com',
 *     token: 'your-token-here'
 *   });
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {errorMessage}</div>;
 *   
 *   return <div>Data: {JSON.stringify(data)}</div>;
 * }
 * ```
 */
const useFetchSingleAxios = <T = any>(
  options: UseFetchSingleAxiosOptions
): UseFetchSingleAxiosReturn<T> => {
  const {
    url,
    method,
    baseURL,
    axiosInstance,
    token = '',
    headers: customHeaders = {},
  } = options;

  const [data, setData] = useState<T>({} as T);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function handleResult(unmounted: boolean, response: any) {
    if (!unmounted) {
      setData(response.data?.data || response.data);
      setLoading(false);
    }
  }

  function handleAxios(
    axiosLib: AxiosStatic | AxiosInstance,
    requestHeaders: {
      cancelToken: CancelToken;
      headers: Record<string, string>;
    }
  ) {
    const fullUrl = baseURL + url;

    switch (method) {
      case 'get':
        return axiosLib.get(fullUrl, requestHeaders);
      case 'post':
        return axiosLib.post(fullUrl, {}, requestHeaders);
      case 'patch':
        return axiosLib.patch(fullUrl, {}, requestHeaders);
      case 'delete':
        return axiosLib.delete(fullUrl, requestHeaders);
    }
  }

  function handleError(e: any, unmounted: boolean) {
    if (!unmounted) {
      setError(true);
      setErrorMessage(e.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    let unmounted = false;
    const source = axios.CancelToken.source();

    const headers = {
      cancelToken: source.token,
      headers: {
        authorization: token ? `Bearer ${token}` : '',
        ...customHeaders,
      },
    };

    const axiosToUse = axiosInstance || axios;

    handleAxios(axiosToUse, headers)
      .then((response) => {
        handleResult(unmounted, response);
      })
      .catch((e) => {
        if (!axios.isCancel(e)) {
          handleError(e, unmounted);
        }
      });

    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  }, [url, method, baseURL, token]);

  return { data, loading, error, errorMessage };
};

export default useFetchSingleAxios;
