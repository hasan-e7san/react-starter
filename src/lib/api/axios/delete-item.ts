import { formatDate } from '../../utils';

export interface DeleteOptions {
  url: string;
  item: any;
  axios: any;
  toast?: any;
  onSuccess?: (item: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

/**
 * Generic delete handler with toast notifications
 * 
 * @param options - Delete operation options
 * 
 * @example
 * ```tsx
 * import { onDelete } from 'izen-react-starter';
 * import { useAxiosAuth } from './hooks/useAxiosAuth';
 * import { toast } from 'sonner';
 * 
 * function MyComponent() {
 *   const axios = useAxiosAuth();
 *   
 *   const handleDelete = (item) => {
 *     onDelete({
 *       url: `/api/items/${item.id}`,
 *       item,
 *       axios,
 *       toast: (options) => toast(options.title, { description: options.description }),
 *       onSuccess: (deletedItem) => {
 *         console.log('Item deleted:', deletedItem);
 *       }
 *     });
 *   };
 * }
 * ```
 */
export const onDelete = ({
  url,
  item,
  axios,
  toast,
  onSuccess,
  onError,
  onFinally,
}: DeleteOptions) => {
  let toastInstance: any = null;

  // Show loading toast if toast function is provided
  if (toast) {
    toastInstance = toast({
      title: 'Please wait ...',
      itemID: 'formSubmitWaiting',
    });
  }

  axios
    .delete(url)
    .then(() => {
      // Call success callback
      if (onSuccess) {
        onSuccess(item);
      }

      // Show success toast
      if (toast) {
        toast({
          itemID: 'SUCCESS',
          title: 'Deleted successfully',
          description: formatDate(new Date()),
          variant: 'success',
        });
      }
    })
    .catch((err: any) => {
      // Call error callback
      if (onError) {
        onError(err);
      }

      // Show error toast
      if (toast) {
        const errorMessage =
          err?.response?.data?.message && typeof err?.response?.data?.message !== 'string'
            ? err.response.data.message[0]
            : err.message;

        toast({
          title: errorMessage,
          description: formatDate(new Date()),
          variant: 'destructive',
        });
      }
    })
    .finally(() => {
      // Dismiss loading toast
      if (toastInstance && toastInstance.dismiss) {
        toastInstance.dismiss();
      }

      // Call finally callback
      if (onFinally) {
        onFinally();
      }
    });
};
