import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export interface SendEmailResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  body: string;
  [key: string]: any;
}

export interface UseSendEmailOptions {
  /**
   * Custom API endpoint
   */
  endpoint?: string;
  /**
   * Callback on success
   */
  onSuccess?: (response: SendEmailResponse) => void;
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
  /**
   * Callback on settle (success or error)
   */
  onSettled?: () => void;
}

/**
 * Hook to send emails through API
 * 
 * @param axios - Configured axios instance
 * @param options - Email configuration options
 * @returns Mutation result object
 * 
 * @example
 * ```tsx
 * import { useSendEmail } from 'izen-react-starter';
 * import useAxiosAuth from './hooks/useAxiosAuth';
 * 
 * function EmailSender() {
 *   const axios = useAxiosAuth({ axiosInstance: myAxios });
 *   const sendEmail = useSendEmail(axios, {
 *     endpoint: '/email/send',
 *     onSuccess: (response) => {
 *       console.log('Email sent successfully');
 *     }
 *   });
 *   
 *   const handleSendEmail = () => {
 *     sendEmail.mutate({
 *       to: 'user@example.com',
 *       subject: 'Hello',
 *       body: 'This is a test email'
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       {sendEmail.isPending && <div>Sending...</div>}
 *       {sendEmail.isError && <div>Error: {sendEmail.error?.message}</div>}
 *       {sendEmail.isSuccess && <div>Email sent!</div>}
 *       <button onClick={handleSendEmail}>Send Email</button>
 *     </div>
 *   );
 * }
 * ```
 */
const useSendEmail = (
  axios: AxiosInstance,
  options: UseSendEmailOptions = {}
): UseMutationResult<SendEmailResponse, Error, SendEmailParams> => {
  const {
    endpoint = '/email/send',
    onSuccess,
    onError,
    onSettled,
  } = options;

  return useMutation({
    mutationFn: async (params: SendEmailParams) => {
      const response = await axios.post<SendEmailResponse>(
        endpoint,
        params
      );

      return response.data;
    },
    onSuccess,
    onError,
    onSettled,
  });
};

export { useSendEmail };
