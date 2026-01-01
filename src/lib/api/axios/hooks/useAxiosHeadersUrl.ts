export interface AxiosHeadersConfig {
  baseURL: string;
  multipartUrls?: string[];
  customHeaders?: Record<string, string>;
}

/**
 * Generate axios headers and URL configuration based on endpoint
 * 
 * @param url - API endpoint path
 * @param config - Configuration options
 * @returns Tuple of [fullUrl, headersConfig]
 * 
 * @example
 * ```tsx
 * import { useAxiosHeadersUrl } from 'izen-react-starter';
 * 
 * function MyComponent() {
 *   const [apiUrl, headers] = useAxiosHeadersUrl('/users', {
 *     baseURL: 'https://api.example.com',
 *     multipartUrls: ['/upload', '/files'],
 *     customHeaders: {
 *       'X-Custom': 'value'
 *     }
 *   });
 *   
 *   // Use with axios
 *   axios.get(apiUrl, headers);
 * }
 * ```
 */
const useAxiosHeadersUrl = (
  url: string,
  config: AxiosHeadersConfig
): [string, { headers: Record<string, string> }] => {
  const { baseURL, multipartUrls = [], customHeaders = {} } = config;

  let headers: Record<string, string> = {
    authorization: `Bearer`,
    Accept: 'application/json',
    ...customHeaders,
  };

  // Check if URL requires multipart/form-data
  const requiresMultipart = multipartUrls.some((multipartUrl) =>
    url.includes(multipartUrl)
  );

  if (requiresMultipart) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  const headersConfig = {
    headers,
  };

  const apiUrl = baseURL + url;

  return [apiUrl, headersConfig];
};

export default useAxiosHeadersUrl;
