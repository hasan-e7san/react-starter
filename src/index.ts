// Import global styles
import './index.css';

// Export all UI components (excludes table/pagination - using custom versions)
export * from './components/ui';

// Export other components
export { Button } from './components/Button';
export { Card } from './components/Card';

// Component categories
export * from './components/charts';
export * from './components/table';
export * from './components/tabs';
export * from './components/overlay';
export * from './components/layout';
export * from './components/modals';
export * from './components/date-picker';
export * from './components/search';
export * from './components/common';

// Navigation components (explicit exports to avoid Sidebar conflict)
export {
  UserNav,
  DashboardNav,
  Sidebar as AppSidebar,
  MobileSidebar
} from './components/navigation';
export type {
  UserNavProps,
  DashboardNavProps,
  SidebarProps as AppSidebarProps,
  TMobileSidebarProps as MobileSidebarProps
} from './components/navigation';

// Form components (explicit exports to avoid conflicts with ui components)
export {
  FileUploadButton,
  DatePicker,
  TimeInput,
  TextInput,
  CheckboxGroup,
  RadioGroup,
  FormInput,
  Select as FormSelect,
  ComboboxSelect,
  FormButtons,
  FormLayout
} from './components/form';
export type {
  FileUploadButtonProps,
  DatePickerProps,
  TimeInputProps,
  TextInputProps,
  CheckboxGroupProps,
  CheckboxItem,
  RadioGroupProps,
  RadioItem,
  FormInputProps,
  SelectProps as FormSelectProps,
  SelectOption,
  ComboboxSelectProps,
  ComboboxOption,
  FormButtonsProps,
  FormLayoutProps
} from './components/form';

// Export contexts
export { LayoutProvider, useLayout } from './contexts/LayoutContext';
export type { LayoutContextType } from './contexts/LayoutContext';

// Export hooks
export { useIsMobile } from './hooks';

// Export lib utilities
export {
  cn,
  capitalize,
  convertToHourMinuteString,
  formatErrorToList,
  formatDate,
  dateFromat,
  createChangeEvent,
  appendFormData,
  debounce,
  throttle,
  handleEditCache,
  handleSingleEditCache,
  // API utilities
  createAxiosInstance,
  createAuthAxiosInstance,
  onDelete,
  useRefreshToken,
  useAxiosAuth,
  useAxiosHeadersUrl,
  useFetchSingleAxios,
  useGet,
  useGetSingle,
  useUploadFile,
  useSendEmail,
} from './lib';
export type { 
  CacheEditOptions,
  // API types
  AxiosConfig,
  DeleteOptions,
  RefreshTokenResponse,
  UseRefreshTokenOptions,
  UseAxiosAuthOptions,
  AxiosHeadersConfig,
  UseFetchSingleAxiosOptions,
  UseFetchSingleAxiosReturn,
  UseGetOptions,
  FileUploadResponse,
  FileUploadParams,
  UseUploadFileOptions,
  SendEmailResponse,
  SendEmailParams,
  UseSendEmailOptions,
} from './lib';

// Export RBAC
export {
  CommonActions,
  userCan,
  useAccessControl,
  AccessControlWrapper,
  withAccessControl,
  UpdateAccessControlWrapper,
  RBACProvider,
  useRBAC
} from './rbac';
export type {
  Action,
  Resource,
  Role,
  RoleLabel,
  Rule,
  RoleRules,
  Rules,
  RBACConfig,
  UseAccessControlReturn,
  AccessControlWrapperProps,
  WithAccessControlProps,
  UpdateAccessControlWrapperProps,
  RBACProviderProps,
  RBACContextType
} from './rbac';

// Export providers
export {
  AuthProvider,
  useAuth,
  ModalProvider,
  useModal,
  OverlayProvider,
  useOverlay,
  ThemeProvider,
  useTheme,
  AppProvider,
  queryClient
} from './providers';

export type {
  AuthProviderProps,
  AuthContextType,
  User,
  BackendTokens,
  ModalProviderProps,
  ModalContextType,
  OverlayProviderProps,
  OverlayContextProps,
  ThemeProviderProps,
  ThemeProviderState,
  Theme,
  AppProviderProps
} from './providers';

// Export routes
export { RequiredAuth, usePathname, useRouter } from './routes';
export type { RequiredAuthProps, Router } from './routes';

// Export services
export { apiService } from './services/apiService';
export type { ApiService } from './services/apiService';

// Export constants
export { pageTitles } from './constants/urls';

// Export types
export type { ButtonProps } from './components/Button';
export type { CardProps } from './components/Card';
