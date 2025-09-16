import { ApiResponse } from "../interfaces";
import { api } from "./api";

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<ApiResponse<T>>({
      url: endpoint,
      method,
      data,
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<T>;
    }
    return {
      success: false,
      message: "Error de conexión con el servidor",
    };
  }
}
