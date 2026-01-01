// Types for RBAC configuration
export type Action = string;
export type Resource = string;
export type Role = string;

// Predefined common actions (can be extended by users)
export const CommonActions = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;

// Type for role labels
export interface RoleLabel {
  label: string;
  value: string;
}

export interface Rule {
  can: string | string[];
  cannot?: string[];
}

export type RoleRules = {
  [action: string]: Rule;
}

export type Rules = {
  [role: string]: RoleRules;
}

export interface RBACConfig {
  roles: string[];
  resources: string[];
  rules: Rules;
  roleLabels?: RoleLabel[];
  defaultResource?: string;
}

// Utility function to check if user can perform action on resource
export const userCan = (
  userRoles: string[],
  action: string,
  target: string,
  rules: Rules,
  defaultResource?: string
): boolean => {
  // Check if target is the default/undefined resource
  if (defaultResource && target === defaultResource) {
    return false;
  }

  for (const role of userRoles) {
    const roleRules = rules[role];
    
    if (!roleRules) {
      continue;
    }
    
    const roleActionRules = roleRules[action];
    
    if (!roleActionRules) {
      continue;
    }
    
    if (
      (roleActionRules.can === "all" || 
       (Array.isArray(roleActionRules.can) && roleActionRules.can.includes(target))) &&
      (!roleActionRules.cannot || !roleActionRules.cannot.includes(target))
    ) {
      return true;
    }
  }
  
  return false;
};
