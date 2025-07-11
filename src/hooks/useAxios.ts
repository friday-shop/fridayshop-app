import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';

export type GetRequest = AxiosRequestConfig | null;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});
instance.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem(
    import.meta.env.VITE_ACCESS_TOKEN_NAME || 'access_token',
  );
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const axiosInstance = instance;

export interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate' | 'isLoading'
  > {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'initialData'
  > {
  initialData?: Data;
}

export default function useAxios<Data = unknown, Error = unknown>(
  request: GetRequest | undefined,
  { initialData, ...config }: Config<Data, Error> = {},
): Return<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    isLoading,
    mutate,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request && JSON.stringify(request),
    () => axiosInstance.request<Data>(request!),
    {
      ...config,
    },
  );
  return {
    data: response && response.data,
    response,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
