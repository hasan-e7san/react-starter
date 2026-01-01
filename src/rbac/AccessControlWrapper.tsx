import React, { ReactElement } from 'react';
import useAccessControl from './useAccessControl';

export interface AccessControlWrapperProps {
  children: ReactElement;
  resource: string;
  action?: string;
  fallback?: ReactElement | null;
}

/**
 * Component to conditionally render children based on RBAC permissions
 * 
 * @param resource - The resource to check access for
 * @param action - The action to check (default: 'read')
 * @param fallback - Component to render if access is denied
 * 
 * @example
 * ```tsx
 * <AccessControlWrapper resource="posts" action="create">
 *   <CreatePostButton />
 * </AccessControlWrapper>
 * ```
 */
export const AccessControlWrapper: React.FC<AccessControlWrapperProps> = ({
  children,
  resource,
  action = 'read',
  fallback = null,
}) => {
  const { isAllowed } = useAccessControl();

  if (!isAllowed(action, resource)) {
    return fallback;
  }

  return children;
};

export interface WithAccessControlProps {
  accessedResource: string;
  accessAction?: string;
}

/**
 * HOC to wrap components with access control
 * 
 * @example
 * ```tsx
 * const ProtectedComponent = withAccessControl(MyComponent);
 * 
 * <ProtectedComponent 
 *   accessedResource="posts" 
 *   accessAction="create"
 *   // ... other props
 * />
 * ```
 */
export const withAccessControl = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return React.forwardRef<any, P & WithAccessControlProps>((props, ref) => {
    const { isAllowed } = useAccessControl();
    const { accessedResource, accessAction = 'read', ...rest } = props;

    if (!isAllowed(accessAction, accessedResource)) {
      return null;
    }

    return <WrappedComponent ref={ref} {...(rest as P)} />;
  });
};

export default withAccessControl;
