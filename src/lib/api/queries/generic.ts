import { useQuery, UseQueryResult } from '@tanstack/react-query';
import useAxiosAuth from '../axios/hooks/useAxiosAuth';

const useGet = <T = any>(key: string, params?: any, url?: string): UseQueryResult<T[]> => {
  const axios = useAxiosAuth();

  return useQuery<T[]>({
    queryKey: [key, params || key, url || key],
    queryFn: async () => {
      const reqUrl = url || key;
      if (reqUrl.includes('undefined') || reqUrl.includes('null')) return [];

      const response = await axios.get(reqUrl, { params });
      return response.data?.data || response.data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const useGetSingle = <T = any>(
  key: string,
  params?: any,
  defaultValue?: T,
  url?: string
): UseQueryResult<T> => {
  const axios = useAxiosAuth();

  return useQuery<T>({
    queryKey: [key, params || key, url || key, JSON.stringify(params)],
    queryFn: async () => {
      const reqUrl = url || key;
      if (reqUrl.includes('undefined') || reqUrl.includes('null')) return defaultValue as T;

      const response = await axios.get(reqUrl, { params });
      return (response.data?.data || response.data || defaultValue) as T;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

export { useGet, useGetSingle };
