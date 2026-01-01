import React, { ReactElement } from 'react';
import useAccessControl from './useAccessControl';

export interface UpdateAccessControlWrapperProps {
  children: ReactElement;
  resource: string;
  fallback?: ReactElement | null;
}

/**
 * Component to conditionally render children based on update permissions
 * 
 * @param resource - The resource to check update access for
 * @param fallback - Component to render if access is denied
 * 
 * @example
 * ```tsx
 * <UpdateAccessControlWrapper resource="posts">
 *   <EditPostButton />
 * </UpdateAccessControlWrapper>
 * ```
 */
export const UpdateAccessControlWrapper: React.FC<UpdateAccessControlWrapperProps> = ({
  children,
  resource,
  fallback = null,
}) => {
  const { isAllowed } = useAccessControl();

  if (!isAllowed('update', resource)) {
    return fallback;
  }

  return children;
};

export default UpdateAccessControlWrapper;
