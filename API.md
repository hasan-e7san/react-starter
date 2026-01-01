# API Utilities Documentation

The API utilities provide a comprehensive set of tools for data fetching, mutations, and axios configuration. These utilities are built on top of Axios and React Query for efficient data management.

## Features

- **Axios Configuration**: Easy setup of axios instances with authentication
- **Authentication Hooks**: Token refresh, interceptors, and auth management
- **Generic Queries**: Reusable hooks for fetching single and multiple items
- **Mutations**: File uploads and email sending with automatic cache updates
- **Cancel Tokens**: Built-in request cancellation support
- **TypeScript Support**: Full type safety with comprehensive interfaces

## Installation

All API utilities are included in the main package:

```bash
npm install izen-react-starter
```

## Setup

### 1. Create Axios Instances

```typescript
import { createAxiosInstance, createAuthAxiosInstance } from 'izen-react-starter';

// Basic instance
const api = createAxiosInstance({
  baseURL: 'https://api.example.com',
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Authenticated instance with cancel token
const authApi = createAuthAxiosInstance({
  baseURL: 'https://api.example.com'
});
```

### 2. Setup Authentication Interceptors

```typescript
import { useAxiosAuth, createAuthAxiosInstance } from 'izen-react-starter';

const axiosInstance = createAuthAxiosInstance({
  baseURL: 'https://api.example.com'
});

function MyComponent() {
  const axios = useAxiosAuth({
    axiosInstance,
    refreshUrl: '/auth/refresh',
    customHeaders: {
      'X-System-Type': 'MyApp'
    },
    onRefreshFail: () => {
      // Redirect to login or handle error
      window.location.href = '/login';
    }
  });

  // Use axios instance in your component
  const fetchData = async () => {
    const response = await axios.get('/api/data');
    return response.data;
  };
}
```

## API Reference

### Axios Configuration

#### `createAxiosInstance(config)`

Create a basic axios instance.

```typescript
function createAxiosInstance(config: AxiosConfig): AxiosInstance
```

**Parameters:**
- `config.baseURL` (string) - Base URL for all requests
- `config.headers?` (Record<string, string>) - Custom headers
- `config.withCredentials?` (boolean) - Include credentials (default: true)

**Returns:** Configured axios instance

```typescript
const api = createAxiosInstance({
  baseURL: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' }
});

const response = await api.get('/users');
```

#### `createAuthAxiosInstance(config)`

Create an authenticated axios instance with cancel token support.

```typescript
function createAuthAxiosInstance(config: AxiosConfig): AxiosInstance
```

```typescript
const authApi = createAuthAxiosInstance({
  baseURL: 'https://api.example.com'
});
```

### Authentication Hooks

#### `useAxiosAuth(options)`

Add authentication interceptors to an axios instance.

```typescript
function useAxiosAuth(options: UseAxiosAuthOptions): AxiosInstance
```

**Options:**
- `axiosInstance` (AxiosInstance) - Axios instance to configure
- `refreshUrl?` (string) - Token refresh endpoint (default: '/auth/refresh')
- `customHeaders?` (Record<string, string>) - Headers to add to requests
- `onRefreshFail?` (function) - Callback when token refresh fails
- `onRefreshSuccess?` (function) - Callback when token is refreshed

**Features:**
- Automatically adds Authorization header with access token
- Handles 401 errors by refreshing token
- Retries failed requests with new token
- Removes interceptors on unmount

```typescript
function UserDashboard() {
  const axios = useAxiosAuth({
    axiosInstance: authApi,
    refreshUrl: '/auth/refresh',
    customHeaders: {
      'X-App-Version': '1.0.0'
    },
    onRefreshFail: () => {
      // Handle logout
      logout();
    }
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/users')
      .then(res => setUsers(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return loading ? <div>Loading...</div> : <UserList users={users} />;
}
```

#### `useRefreshToken(options)`

Manually refresh authentication tokens.

```typescript
function useRefreshToken(options?: UseRefreshTokenOptions): () => Promise<RefreshTokenResponse | null>
```

**Options:**
- `refreshUrl?` (string) - Token refresh endpoint
- `onSuccess?` (function) - Callback on successful refresh
- `onError?` (function) - Callback on refresh error

**Returns:** Async function that returns new tokens or null

```typescript
function TokenRefresher() {
  const refresh = useRefreshToken({
    refreshUrl: '/auth/refresh',
    onSuccess: (tokens) => {
      console.log('Tokens refreshed successfully');
    }
  });

  const handleRefresh = async () => {
    const newTokens = await refresh();
    if (newTokens) {
      console.log('New access token:', newTokens.access_token);
    }
  };

  return <button onClick={handleRefresh}>Refresh Token</button>;
}
```

### Utility Hooks

#### `useAxiosHeadersUrl(url, config)`

Generate axios headers and URL configuration.

```typescript
function useAxiosHeadersUrl(url: string, config: AxiosHeadersConfig): [string, { headers: Record<string, string> }]
```

**Returns:** Tuple of [apiUrl, headersConfig]

```typescript
const [apiUrl, headers] = useAxiosHeadersUrl('/users/upload', {
  baseURL: 'https://api.example.com',
  multipartUrls: ['/upload', '/files'],
  customHeaders: { 'X-Custom': 'value' }
});

// Use with axios
const response = await axios.post(apiUrl, formData, headers);
```

#### `useFetchSingleAxios(options)`

Fetch data with cancel token support.

```typescript
function useFetchSingleAxios<T>(options: UseFetchSingleAxiosOptions): UseFetchSingleAxiosReturn<T>
```

**Options:**
- `url` (string) - API endpoint
- `method` ('get' | 'post' | 'patch' | 'delete') - HTTP method
- `baseURL` (string) - Base URL
- `token?` (string) - Authorization token
- `headers?` (Record<string, string>) - Custom headers

**Returns:** `{ data, loading, error, errorMessage }`

```typescript
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetchSingleAxios({
    url: `/users/${userId}`,
    method: 'get',
    baseURL: 'https://api.example.com',
    token: localStorage.getItem('token')
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{user.name}</div>;
}
```

### Query Hooks

#### `useGet(axios, key, options)`

Fetch multiple items with caching.

```typescript
function useGet<T>(axios: AxiosInstance, key: string, options?: UseGetOptions): UseQueryResult<T[], Error>
```

**Options:**
- `queryKey?` (string) - Cache key
- `params?` (Record<string, any>) - Query parameters
- `url?` (string) - Override URL
- `staleTime?` (number) - Cache duration in ms
- `refetchOnWindowFocus?` (boolean) - Refetch on window focus
- `refetchOnMount?` (boolean) - Refetch on mount
- `refetchOnReconnect?` (boolean) - Refetch on reconnect
- `enabled?` (boolean) - Enable the query

**Returns:** React Query result with data as array

```typescript
import { useGet } from 'izen-react-starter';

function UsersList({ page = 1 }) {
  const { data: users, isLoading, error } = useGet(axios, '/users', {
    queryKey: 'users',
    params: { page, limit: 10 },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### `useGetSingle(axios, key, options)`

Fetch a single item with caching.

```typescript
function useGetSingle<T>(axios: AxiosInstance, key: string, options?: UseGetOptions & { defaultValue?: T }): UseQueryResult<T, Error>
```

**Options:**
- All options from `useGet` plus:
- `defaultValue?` (T) - Default value while loading

**Returns:** React Query result with data as single object

```typescript
import { useGetSingle } from 'izen-react-starter';

function UserDetail({ userId }) {
  const { data: user, isLoading, error } = useGetSingle(axios, `/users/${userId}`, {
    queryKey: `user-${userId}`,
    defaultValue: { id: 0, name: 'Loading...' },
    enabled: !!userId
  });

  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}
```

### Mutation Hooks

#### `useUploadFile(axios, options)`

Upload files with automatic cache update.

```typescript
function useUploadFile(axios: AxiosInstance, options?: UseUploadFileOptions): UseMutationResult<FileUploadResponse, Error, FileUploadParams>
```

**Options:**
- `queryKey?` (string) - Cache key to invalidate
- `endpoint?` (string) - Upload endpoint (default: '/shared/attachments')
- `additionalData?` (Record<string, any>) - Extra form fields
- `onSuccess?` (function) - Success callback
- `onError?` (function) - Error callback
- `onSettled?` (function) - Settled callback

**Mutation Parameters:**
- `file` (File) - File to upload
- `modelId` (number | string) - Associated model ID
- `model` (string) - Associated model name

```typescript
import { useUploadFile } from 'izen-react-starter';

function FileUploader() {
  const uploadMutation = useUploadFile(axios, {
    queryKey: 'files',
    endpoint: '/upload',
    onSuccess: (response) => {
      toast.success('File uploaded successfully');
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate({
        file,
        modelId: 123,
        model: 'posts'
      });
    }
  };

  return (
    <div>
      {uploadMutation.isPending && <div>Uploading...</div>}
      {uploadMutation.isError && <div>Error: {uploadMutation.error?.message}</div>}
      <input type="file" onChange={handleFileSelect} />
    </div>
  );
}
```

#### `useSendEmail(axios, options)`

Send emails through API.

```typescript
function useSendEmail(axios: AxiosInstance, options?: UseSendEmailOptions): UseMutationResult<SendEmailResponse, Error, SendEmailParams>
```

**Options:**
- `endpoint?` (string) - Email endpoint (default: '/email/send')
- `onSuccess?` (function) - Success callback
- `onError?` (function) - Error callback
- `onSettled?` (function) - Settled callback

**Mutation Parameters:**
- `to` (string | string[]) - Recipient email(s)
- `subject` (string) - Email subject
- `body` (string) - Email body
- `[key: string]` (any) - Additional fields

```typescript
import { useSendEmail } from 'izen-react-starter';

function EmailSender() {
  const sendEmail = useSendEmail(axios, {
    endpoint: '/api/email/send',
    onSuccess: (response) => {
      toast.success('Email sent successfully');
    }
  });

  const handleSend = () => {
    sendEmail.mutate({
      to: ['user1@example.com', 'user2@example.com'],
      subject: 'Welcome!',
      body: 'Welcome to our platform',
      template: 'welcome'
    });
  };

  return (
    <div>
      {sendEmail.isPending && <div>Sending...</div>}
      {sendEmail.isSuccess && <div>Email sent!</div>}
      <button onClick={handleSend}>Send Email</button>
    </div>
  );
}
```

### Utility Functions

#### `onDelete(options)`

Generic delete handler with toast notifications.

```typescript
function onDelete(options: DeleteOptions): void
```

**Options:**
- `url` (string) - Delete endpoint
- `item` (any) - Item being deleted
- `axios` (AxiosInstance) - Axios instance
- `toast?` (function) - Toast notification function
- `onSuccess?` (function) - Success callback
- `onError?` (function) - Error callback
- `onFinally?` (function) - Finally callback

```typescript
import { onDelete } from 'izen-react-starter';
import { toast } from 'sonner';

function UserCard({ user }) {
  const handleDelete = () => {
    onDelete({
      url: `/users/${user.id}`,
      item: user,
      axios,
      toast: (options) => toast(options.title, { description: options.description }),
      onSuccess: () => {
        console.log('User deleted');
        // Refresh user list
      },
      onError: (error) => {
        console.error('Delete failed', error);
      }
    });
  };

  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

## Complete Example

```typescript
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAuthAxiosInstance,
  useAxiosAuth,
  useGet,
  useGetSingle,
  useUploadFile,
  useRefreshToken,
} from 'izen-react-starter';

// Setup axios instance
const authApi = createAuthAxiosInstance({
  baseURL: 'https://api.example.com'
});

function Dashboard() {
  const axios = useAxiosAuth({
    axiosInstance: authApi,
    refreshUrl: '/auth/refresh',
    customHeaders: {
      'X-App': 'MyApp'
    },
    onRefreshFail: () => {
      window.location.href = '/login';
    }
  });

  const refresh = useRefreshToken();
  const queryClient = useQueryClient();

  // Fetch users list
  const { data: users, isLoading: usersLoading } = useGet(axios, '/users', {
    queryKey: 'users',
    params: { page: 1, limit: 20 }
  });

  // Fetch single user
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { data: selectedUser } = useGetSingle(axios, `/users/${selectedUserId}`, {
    enabled: !!selectedUserId
  });

  // Upload file
  const uploadFile = useUploadFile(axios, {
    queryKey: 'files',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleFileUpload = (file: File) => {
    uploadFile.mutate({
      file,
      modelId: selectedUserId,
      model: 'users'
    });
  };

  if (usersLoading) return <div>Loading users...</div>;

  return (
    <div>
      <h1>Users Dashboard</h1>
      <ul>
        {users?.map(user => (
          <li key={user.id} onClick={() => setSelectedUserId(user.id)}>
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h2>{selectedUser.name}</h2>
          <input type="file" onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }} />
          {uploadFile.isPending && <div>Uploading...</div>}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
```

## Best Practices

1. **Reuse axios instances** - Create once, use throughout app
2. **Configure auth interceptors** - Set up token refresh automatically
3. **Use proper query keys** - For cache invalidation and updates
4. **Handle errors gracefully** - Provide user feedback
5. **Cancel requests on unmount** - Prevent memory leaks
6. **Type your responses** - Use TypeScript generics
7. **Set appropriate cache times** - Balance freshness vs performance
8. **Use mutation callbacks** - For side effects and UI updates

## Troubleshooting

### Token Refresh Loop
If you're stuck in a token refresh loop, check:
- Token refresh endpoint is correct
- Refresh token is valid
- Network request is succeeding

### Stale Data
Adjust `staleTime` option:
```typescript
useGet(axios, '/data', {
  staleTime: 10 * 60 * 1000 // 10 minutes
});
```

### Request Cancellation
All hooks automatically cancel pending requests on unmount. To manually cancel:
```typescript
const { cancel } = uploadFile;
cancel(); // Cancels in-flight request
```

### CORS Issues
Ensure your axios instance has proper cors configuration:
```typescript
const api = createAxiosInstance({
  baseURL: 'https://api.example.com',
  withCredentials: true // For cookies/auth headers
});
```
