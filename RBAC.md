# RBAC (Role-Based Access Control) System

The RBAC system provides a flexible way to manage user permissions in your React application. You can define custom roles, resources, and rules that fit your application's needs.

## Setup

### 1. Define Your RBAC Configuration

Create your RBAC configuration with roles, resources, and rules:

```typescript
import { RBACConfig, CommonActions } from 'izen-react-starter';

// Define your resources
const Resources = {
  Posts: 'posts',
  Comments: 'comments',
  Users: 'users',
  Settings: 'settings',
} as const;

// Define your roles
const Roles = {
  Admin: 'admin',
  Editor: 'editor',
  Viewer: 'viewer',
} as const;

// Create your RBAC configuration
const rbacConfig: RBACConfig = {
  roles: Object.values(Roles),
  resources: Object.values(Resources),
  defaultResource: 'default', // Optional: resource identifier for undefined/default routes
  roleLabels: [
    { label: 'Administrator', value: Roles.Admin },
    { label: 'Editor', value: Roles.Editor },
    { label: 'Viewer', value: Roles.Viewer },
  ],
  rules: {
    [Roles.Admin]: {
      [CommonActions.Manage]: { can: 'all' },
      [CommonActions.Create]: { can: 'all' },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { can: 'all' },
      [CommonActions.Delete]: { can: 'all' },
    },
    [Roles.Editor]: {
      [CommonActions.Create]: { 
        can: [Resources.Posts, Resources.Comments],
        cannot: [Resources.Users] // Explicitly deny certain resources
      },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { 
        can: [Resources.Posts, Resources.Comments] 
      },
      [CommonActions.Delete]: { 
        can: [Resources.Comments] 
      },
    },
    [Roles.Viewer]: {
      [CommonActions.Read]: { can: 'all' },
    },
  },
};

export { rbacConfig, Resources, Roles };
```

### 2. Wrap Your App with RBACProvider

Add the `RBACProvider` to your application root:

```typescript
import { RBACProvider, AuthProvider } from 'izen-react-starter';
import { rbacConfig } from './config/rbac';

function App() {
  return (
    <AuthProvider>
      <RBACProvider config={rbacConfig}>
        {/* Your app components */}
      </RBACProvider>
    </AuthProvider>
  );
}
```

**Important:** The `RBACProvider` must be inside the `AuthProvider` since it depends on user authentication context.

## Usage

### Using the useAccessControl Hook

Check permissions programmatically:

```typescript
import { useAccessControl } from 'izen-react-starter';
import { Resources, Roles } from './config/rbac';

function PostEditor() {
  const { isAllowed } = useAccessControl();

  const handleDelete = () => {
    if (isAllowed('delete', Resources.Posts)) {
      // Delete the post
    } else {
      alert('You do not have permission to delete posts');
    }
  };

  return (
    <div>
      {isAllowed('update', Resources.Posts) && (
        <button>Edit Post</button>
      )}
      {isAllowed('delete', Resources.Posts) && (
        <button onClick={handleDelete}>Delete Post</button>
      )}
    </div>
  );
}
```

### Using AccessControlWrapper Component

Conditionally render components based on permissions:

```typescript
import { AccessControlWrapper } from 'izen-react-starter';
import { Resources } from './config/rbac';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <AccessControlWrapper 
        resource={Resources.Posts} 
        action="create"
      >
        <CreatePostButton />
      </AccessControlWrapper>

      <AccessControlWrapper 
        resource={Resources.Users} 
        action="manage"
        fallback={<div>You don't have permission to manage users</div>}
      >
        <UserManagementPanel />
      </AccessControlWrapper>
    </div>
  );
}
```

### Using UpdateAccessControlWrapper

Shorthand for checking update permissions:

```typescript
import { UpdateAccessControlWrapper } from 'izen-react-starter';
import { Resources } from './config/rbac';

function PostCard({ post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      
      <UpdateAccessControlWrapper resource={Resources.Posts}>
        <button>Edit</button>
      </UpdateAccessControlWrapper>
    </div>
  );
}
```

### Using withAccessControl HOC

Wrap entire components with access control:

```typescript
import { withAccessControl } from 'izen-react-starter';
import { Resources } from './config/rbac';

function AdminPanel() {
  return <div>Admin Panel Content</div>;
}

// Wrap the component with access control
const ProtectedAdminPanel = withAccessControl(AdminPanel);

// Use it with access props
function App() {
  return (
    <ProtectedAdminPanel 
      accessedResource={Resources.Settings}
      accessAction="manage"
    />
  );
}
```

### Get Resource from URL

Automatically determine resource from URL:

```typescript
import { useAccessControl } from 'izen-react-starter';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAllowed, getResourceByUrl } = useAccessControl();
  const location = useLocation();
  
  const resource = getResourceByUrl(location.pathname);
  
  if (!isAllowed('read', resource)) {
    return <div>Access Denied</div>;
  }
  
  return children;
}
```

## Custom Actions

While `CommonActions` provides standard CRUD operations, you can define custom actions:

```typescript
const CustomActions = {
  ...CommonActions,
  Publish: 'publish',
  Archive: 'archive',
  Export: 'export',
} as const;

// Use in your rules
const rbacConfig: RBACConfig = {
  // ... other config
  rules: {
    editor: {
      publish: { can: ['posts', 'articles'] },
      archive: { can: ['posts'] },
      export: { can: 'all' },
    },
  },
};
```

## User Role Configuration

Ensure your user object from `AuthProvider` includes a `role` property:

```typescript
// Single role
const user = {
  id: '1',
  name: 'John Doe',
  role: 'admin', // Single role as string
};

// Multiple roles (if needed)
const user = {
  id: '1',
  name: 'John Doe',
  role: ['admin', 'editor'], // Multiple roles as array
};
```

## API Reference

### RBACConfig

```typescript
interface RBACConfig {
  roles: string[];              // Array of role identifiers
  resources: string[];          // Array of resource identifiers
  rules: Rules;                 // Permission rules for each role
  roleLabels?: RoleLabel[];     // Optional display labels for roles
  defaultResource?: string;     // Optional default/undefined resource
}
```

### Rule

```typescript
interface Rule {
  can: string | string[];       // 'all' or array of resources
  cannot?: string[];            // Optional array of denied resources
}
```

### CommonActions

```typescript
const CommonActions = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;
```

### useAccessControl

```typescript
interface UseAccessControlReturn {
  isAllowed: (action: string, target: string) => boolean;
  getResourceByUrl: (url: string) => string;
}
```

### useRBAC

```typescript
interface RBACContextType {
  config: RBACConfig;
  rules: Rules;
  defaultResource?: string;
  resources: string[];
  roles: string[];
}
```

## Best Practices

1. **Define constants for roles and resources** to avoid typos
2. **Use TypeScript** for type safety with your custom roles and resources
3. **Keep rules centralized** in a single configuration file
4. **Test permissions** thoroughly for each role
5. **Document your permission structure** for your team
6. **Use descriptive action names** that match your domain
7. **Consider role hierarchies** - admins typically get 'all' permissions
8. **Handle unauthorized access gracefully** with fallback UI

## Migration from Static RBAC

If you were using the previous static RBAC system:

### Before (Static)
```typescript
import { Action, Resource, Role } from 'izen-react-starter';

// Enums were predefined
if (isAllowed(Action.Create, Resource.Posts)) {
  // ...
}
```

### After (Dynamic)
```typescript
import { RBACProvider, useAccessControl } from 'izen-react-starter';

// Define your own resources and actions
const Resources = { Posts: 'posts' };
const Actions = { Create: 'create' };

// Configure RBAC
<RBACProvider config={rbacConfig}>
  <App />
</RBACProvider>

// Use with strings
if (isAllowed('create', 'posts')) {
  // ...
}
```

## Example: Complete Setup

```typescript
// config/rbac.ts
import { RBACConfig, CommonActions } from 'izen-react-starter';

export const Resources = {
  Dashboard: 'dashboard',
  Posts: 'posts',
  Comments: 'comments',
  Users: 'users',
  Settings: 'settings',
  Analytics: 'analytics',
} as const;

export const Roles = {
  SuperAdmin: 'super-admin',
  Admin: 'admin',
  Editor: 'editor',
  Author: 'author',
  Viewer: 'viewer',
} as const;

export const rbacConfig: RBACConfig = {
  roles: Object.values(Roles),
  resources: Object.values(Resources),
  defaultResource: 'default',
  roleLabels: [
    { label: 'Super Administrator', value: Roles.SuperAdmin },
    { label: 'Administrator', value: Roles.Admin },
    { label: 'Editor', value: Roles.Editor },
    { label: 'Author', value: Roles.Author },
    { label: 'Viewer', value: Roles.Viewer },
  ],
  rules: {
    [Roles.SuperAdmin]: {
      [CommonActions.Manage]: { can: 'all' },
      [CommonActions.Create]: { can: 'all' },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { can: 'all' },
      [CommonActions.Delete]: { can: 'all' },
    },
    [Roles.Admin]: {
      [CommonActions.Manage]: { 
        can: 'all',
        cannot: [Resources.Settings] // Can't manage system settings
      },
      [CommonActions.Create]: { can: 'all' },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { can: 'all' },
      [CommonActions.Delete]: { 
        can: 'all',
        cannot: [Resources.Users] // Can't delete users
      },
    },
    [Roles.Editor]: {
      [CommonActions.Create]: { 
        can: [Resources.Posts, Resources.Comments] 
      },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { 
        can: [Resources.Posts, Resources.Comments] 
      },
      [CommonActions.Delete]: { 
        can: [Resources.Comments] 
      },
    },
    [Roles.Author]: {
      [CommonActions.Create]: { can: [Resources.Posts] },
      [CommonActions.Read]: { can: 'all' },
      [CommonActions.Update]: { can: [Resources.Posts] },
    },
    [Roles.Viewer]: {
      [CommonActions.Read]: { can: 'all' },
    },
  },
};

// App.tsx
import { AuthProvider, RBACProvider, AppProvider } from 'izen-react-starter';
import { rbacConfig } from './config/rbac';

function App() {
  return (
    <AuthProvider>
      <RBACProvider config={rbacConfig}>
        <AppProvider>
          <YourApp />
        </AppProvider>
      </RBACProvider>
    </AuthProvider>
  );
}
```
