// Axios configuration and utilities
export {
  createAxiosInstance,
  createAuthAxiosInstance,
} from './axios';
export type { AxiosConfig } from './axios';

// Delete utilities
export { onDelete } from './delete-item';
export type { DeleteOptions } from './delete-item';

// Token refresh
export { default as useRefreshToken } from './useRefreshToken';
export type { RefreshTokenResponse, UseRefreshTokenOptions } from './useRefreshToken';

// Hooks
export { default as useAxiosAuth } from './hooks/useAxiosAuth';
export type { UseAxiosAuthOptions } from './hooks/useAxiosAuth';

export { default as useAxiosHeadersUrl } from './hooks/useAxiosHeadersUrl';
export type { AxiosHeadersConfig } from './hooks/useAxiosHeadersUrl';

export { default as useFetchSingleAxios } from './hooks/useFetchSingleAxios';
export type { UseFetchSingleAxiosOptions, UseFetchSingleAxiosReturn } from './hooks/useFetchSingleAxios';
