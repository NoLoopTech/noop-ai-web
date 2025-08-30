import type { AxiosRequestConfig } from "axios"
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult
} from "@tanstack/react-query"
import fastApiAxiosInstance from "../axios.fastapi.instance"

export const useFastApiMutation = <
  TData = unknown,
  TVariables = unknown,
  TError = unknown
>(
  url: string,
  method: "delete" | "post" | "put" | "patch" = "post",
  options: UseMutationOptions<TData, TError, TVariables> = {},
  axiosConfiguration: Partial<AxiosRequestConfig> = {}
): UseMutationResult<TData, TError, TVariables> => {
  const config: AxiosRequestConfig | undefined = axiosConfiguration

  return useMutation<TData, TError, TVariables>({
    retry: 0,
    mutationFn: async data => {
      return await fastApiAxiosInstance
        .request({
          url,
          method,
          data,
          ...config
        })
        .then(response => response.data)
    },
    ...options
  })
}
