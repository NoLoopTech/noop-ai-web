import axios, { AxiosInstance } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_FAST_API_URL as string

const fastApiAxiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

fastApiAxiosInstance.interceptors.response.use(
  response => response,
  error => {
    throw error.response
  }
)

export default fastApiAxiosInstance
