# API Utilities Quick Reference

Fast lookup guide for using API utilities in izen-react-starter.

## Installation

```bash
npm install izen-react-starter
# or if using React 19:
npm install izen-react-starter --legacy-peer-deps
```

## Quick Start

### 1. Setup Axios Instance

```typescript
import { createAuthAxiosInstance } from 'izen-react-starter';

const api = createAuthAxiosInstance({
  baseURL: 'https://api.example.com'
});
```

### 2. Add Auth Interceptors

```typescript
import { useAxiosAuth } from 'izen-react-starter';

function MyComponent() {
  const axios = useAxiosAuth({
    axiosInstance: api,
    refreshUrl: '/auth/refresh'
  });

  // Use axios in your component
}
```

### 3. Fetch Data

```typescript
import { useGet } from 'izen-react-starter';

const { data: users, isLoading } = useGet(axios, '/users', {
  queryKey: 'users'
});
```

## Common Patterns

### Fetch Single Item

```typescript
import { useGetSingle } from 'izen-react-starter';

const { data: user, isLoading } = useGetSingle(axios, `/users/${id}`, {
  enabled: !!id
});
```

### Upload File

```typescript
import { useUploadFile } from 'izen-react-starter';

const upload = useUploadFile(axios, {
  queryKey: 'files',
  onSuccess: () => console.log('Done!')
});

upload.mutate({
  file: fileInput,
  modelId: 123,
  model: 'posts'
});
```

### Send Email

```typescript
import { useSendEmail } from 'izen-react-starter';

const send = useSendEmail(axios, {
  endpoint: '/api/email/send'
});

send.mutate({
  to: 'user@example.com',
  subject: 'Hello',
  body: 'Test message'
});
```

### Delete Item

```typescript
import { onDelete } from 'izen-react-starter';

onDelete({
  url: `/items/${item.id}`,
  item,
  axios,
  onSuccess: () => console.log('Deleted!')
});
```

### Refresh Token

```typescript
import { useRefreshToken } from 'izen-react-starter';

const refresh = useRefreshToken({
  refreshUrl: '/auth/refresh'
});

const newTokens = await refresh();
```

## Hooks Cheat Sheet

| Hook | Purpose | Returns |
|------|---------|---------|
| `useGet` | Fetch multiple items | `UseQueryResult<T[]>` |
| `useGetSingle` | Fetch single item | `UseQueryResult<T>` |
| `useUploadFile` | Upload file | `UseMutationResult` |
| `useSendEmail` | Send email | `UseMutationResult` |
| `useAxiosAuth` | Add auth interceptors | `AxiosInstance` |
| `useRefreshToken` | Refresh tokens | `() => Promise<Tokens>` |
| `useAxiosHeadersUrl` | Generate headers | `[url, headers]` |
| `useFetchSingleAxios` | Direct fetch | `{data, loading, error}` |

## Functions Cheat Sheet

| Function | Purpose | Parameters |
|----------|---------|------------|
| `createAxiosInstance` | Create axios | `config: AxiosConfig` |
| `createAuthAxiosInstance` | Create auth axios | `config: AxiosConfig` |
| `onDelete` | Delete with toast | `options: DeleteOptions` |

## Configuration Options

### Axios Config
```typescript
{
  baseURL: string;              // Required
  headers?: Record<string, string>;
  withCredentials?: boolean;    // Default: true
}
```

### useGet / useGetSingle Options
```typescript
{
  queryKey?: string;
  params?: Record<string, any>;
  url?: string;
  staleTime?: number;           // Cache time in ms
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  enabled?: boolean;
}
```

### useAxiosAuth Options
```typescript
{
  axiosInstance: AxiosInstance;  // Required
  refreshUrl?: string;
  customHeaders?: Record<string, string>;
  onRefreshFail?: () => void;
  onRefreshSuccess?: (tokens) => void;
}
```

### useUploadFile Options
```typescript
{
  queryKey?: string;
  endpoint?: string;
  additionalData?: Record<string, any>;
  onSuccess?: (response) => void;
  onError?: (error) => void;
  onSettled?: () => void;
}
```

## State Management

### React Query Integration
- Automatic caching
- Automatic refetch on focus/reconnect
- Manual cache invalidation via `queryClient.invalidateQueries()`
- Mutation success automatically invalidates related queries

### Token Management
- Tokens stored in AuthProvider
- Automatic refresh on 401 errors
- Custom refresh URL support
- Fallback redirect on refresh failure

## Error Handling

### In Queries
```typescript
const { data, error, isError } = useGet(axios, '/users');

if (isError) {
  return <div>Error: {error.message}</div>;
}
```

### In Mutations
```typescript
const mutation = useUploadFile(axios, {
  onError: (error) => {
    console.error('Upload failed:', error.message);
  }
});
```

### In Delete
```typescript
onDelete({
  // ...
  onError: (error) => {
    toast.error(`Failed to delete: ${error.message}`);
  }
});
```

## TypeScript Support

All functions are fully typed:

```typescript
import { useGet, UseGetOptions } from 'izen-react-starter';

interface User {
  id: number;
  name: string;
  email: string;
}

const { data: users } = useGet<User>(axios, '/users');
// users is typed as User[] | undefined
```

## Performance Tips

1. **Set appropriate staleTime**
   ```typescript
   useGet(axios, '/data', { 
     staleTime: 5 * 60 * 1000  // 5 minutes
   });
   ```

2. **Disable queries when not needed**
   ```typescript
   useGet(axios, `/items/${id}`, {
     enabled: !!id  // Won't fetch if id is falsy
   });
   ```

3. **Use queryKey consistently**
   ```typescript
   // Same queryKey will share cache
   useGet(axios, '/users', { queryKey: 'users' });
   useGet(axios, '/users?role=admin', { queryKey: 'users' });
   ```

4. **Invalidate only what changed**
   ```typescript
   queryClient.invalidateQueries({ 
     queryKey: ['users', userId] 
   });
   // Won't invalidate other user queries
   ```

## Common Issues & Solutions

### Q: Token refresh loop?
**A:** Check refresh URL is correct and token is actually refreshing

### Q: Stale data showing?
**A:** Increase `staleTime` or decrease refetch frequency

### Q: Requests not cancelling?
**A:** Check component unmounts properly, hooks clean up automatically

### Q: CORS errors?
**A:** Ensure `withCredentials: true` if sending cookies

### Q: 401 errors persisting?
**A:** Verify refresh token is valid and stored correctly

## API Documentation

For detailed documentation, see:
- [API.md](./API.md) - Comprehensive API reference
- [API-INTEGRATION.md](./API-INTEGRATION.md) - Integration details

## Examples Repository

Check `react-starter-docs` for live examples of all API utilities in action.

## Support

- Report issues on GitHub
- Check existing documentation
- Review example implementations
