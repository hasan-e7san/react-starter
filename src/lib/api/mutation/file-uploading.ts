import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export interface FileUploadResponse {
  data: any;
  message: string;
  status?: number;
}

export interface FileUploadParams {
  file: File;
  modelId: number | string;
  model: string;
  [key: string]: any;
}

export interface UseUploadFileOptions {
  /**
   * Cache key for invalidation
   */
  queryKey?: string;
  /**
   * Callback on success
   */
  onSuccess?: (response: FileUploadResponse) => void;
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
  /**
   * Callback on settle (success or error)
   */
  onSettled?: () => void;
  /**
   * Custom API endpoint
   */
  endpoint?: string;
  /**
   * Additional form data fields
   */
  additionalData?: Record<string, any>;
}

/**
 * Hook to upload files with automatic cache update
 * 
 * @param axios - Configured axios instance
 * @param options - Upload configuration options
 * @returns Mutation result object
 * 
 * @example
 * ```tsx
 * import { useUploadFile } from 'izen-react-starter';
 * import useAxiosAuth from './hooks/useAxiosAuth';
 * 
 * function FileUploader() {
 *   const axios = useAxiosAuth({ axiosInstance: myAxios });
 *   const uploadMutation = useUploadFile(axios, {
 *     queryKey: 'files',
 *     endpoint: '/shared/attachments',
 *     onSuccess: (response) => {
 *       console.log('File uploaded:', response);
 *     }
 *   });
 *   
 *   const handleUpload = (file, modelId) => {
 *     uploadMutation.mutate({
 *       file,
 *       modelId,
 *       model: 'users'
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       {uploadMutation.isPending && <div>Uploading...</div>}
 *       {uploadMutation.isError && <div>Error: {uploadMutation.error?.message}</div>}
 *       <input
 *         type="file"
 *         onChange={(e) => {
 *           const file = e.target.files?.[0];
 *           if (file) handleUpload(file, 1);
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
const useUploadFile = (
  axios: AxiosInstance,
  options: UseUploadFileOptions = {}
): UseMutationResult<FileUploadResponse, Error, FileUploadParams> => {
  const {
    queryKey = 'files',
    onSuccess,
    onError,
    onSettled,
    endpoint = '/shared/attachments',
    additionalData = {},
  } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [queryKey],
    mutationFn: async (params: FileUploadParams) => {
      const { file, modelId, model, ...rest } = params;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('modelId', String(modelId));

      // Add additional fields to form data
      Object.entries({ ...additionalData, ...rest }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await axios.post<FileUploadResponse>(
        `${endpoint}/${model}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
    onSettled,
  });
};

export { useUploadFile };
