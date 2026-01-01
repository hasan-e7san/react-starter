import { useAuth } from '../providers/AuthProvider';
import { userCan } from './access-rules';
import { useRBAC } from './RBACProvider';

export interface UseAccessControlReturn {
  isAllowed: (action: string, target: string) => boolean;
  getResourceByUrl: (url: string) => string;
}

/**
 * Hook to check access control permissions
 * 
 * @returns Object with isAllowed and getResourceByUrl functions
 * 
 * @example
 * ```tsx
 * const { isAllowed } = useAccessControl();
 * 
 * if (isAllowed('create', 'posts')) {
 *   // User can create posts
 * }
 * ```
 */
export const useAccessControl = (): UseAccessControlReturn => {
  const { user } = useAuth();
  const { rules, resources, defaultResource } = useRBAC();

  const isAllowed = (action: string, target: string): boolean => {
    // Allow access to auth resource by default (if configured)
    if (defaultResource && target === defaultResource) {
      return true;
    }
    
    if (!user || !user.role) {
      return false;
    }

    // Support both single role (string) and multiple roles (array)
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];

    return userCan(userRoles, action, target, rules, defaultResource);
  };

  const getResourceByUrl = (url: string): string => {
    for (const resource of resources) {
      if (url.startsWith("/" + resource)) {
        return resource;
      }
    }

    return defaultResource || '';
  };

  return { isAllowed, getResourceByUrl };
};

export default useAccessControl;
