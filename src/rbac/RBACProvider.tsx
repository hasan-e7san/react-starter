import { createContext, useContext, ReactNode } from 'react';
import { RBACConfig, Rules } from './access-rules';

export interface RBACContextType {
  config: RBACConfig;
  rules: Rules;
  defaultResource?: string;
  resources: string[];
  roles: string[];
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export interface RBACProviderProps {
  children: ReactNode;
  config: RBACConfig;
}

/**
 * RBACProvider - Provides RBAC configuration to the application
 * 
 * @param config - The RBAC configuration object containing:
 *   - roles: Array of role identifiers
 *   - resources: Array of resource identifiers
 *   - rules: Object mapping roles to their permissions
 *   - roleLabels: Optional array of role display labels
 *   - defaultResource: Optional default/undefined resource identifier
 * 
 * @example
 * ```tsx
 * const rbacConfig = {
 *   roles: ['admin', 'user'],
 *   resources: ['posts', 'comments'],
 *   rules: {
 *     admin: {
 *       manage: { can: 'all' },
 *       create: { can: 'all' },
 *       read: { can: 'all' },
 *       update: { can: 'all' },
 *       delete: { can: 'all' },
 *     },
 *     user: {
 *       read: { can: ['posts', 'comments'] },
 *       create: { can: ['comments'] },
 *     }
 *   },
 *   roleLabels: [
 *     { label: 'Administrator', value: 'admin' },
 *     { label: 'User', value: 'user' }
 *   ]
 * };
 * 
 * <RBACProvider config={rbacConfig}>
 *   <App />
 * </RBACProvider>
 * ```
 */
export const RBACProvider = ({ children, config }: RBACProviderProps) => {
  const contextValue: RBACContextType = {
    config,
    rules: config.rules,
    defaultResource: config.defaultResource,
    resources: config.resources,
    roles: config.roles,
  };

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}
