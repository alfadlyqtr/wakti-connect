
export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

export type QueryConfig = {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
};

export type MutationConfig = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};
