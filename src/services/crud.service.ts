import apiClient from "@/lib/api-client";
import type { PaginatedResponse } from "@/types";

export interface QueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  ordering?: string;
  [key: string]: string | number | undefined;
}

export class CrudService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(this.endpoint, {
      params,
    });
    return response.data;
  }

  async getOne(id: string): Promise<T> {
    const response = await apiClient.get<T>(`${this.endpoint}${id}/`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await apiClient.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await apiClient.put<T>(`${this.endpoint}${id}/`, data);
    return response.data;
  }

  async partialUpdate(id: string, data: Partial<T>): Promise<T> {
    const response = await apiClient.patch<T>(`${this.endpoint}${id}/`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}${id}/`);
  }

  // FastAPI v2 typically uses /{resource}/{id}/comments/ and /{resource}/{id}/attachments/
  // These paths may need adjustment based on actual router implementation
  async addComment(id: string, comment: string): Promise<any> {
    const response = await apiClient.post(`${this.endpoint}${id}/comments/`, {
      comment,
    });
    return response.data;
  }

  async addAttachment(id: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await apiClient.post(
      `${this.endpoint}${id}/attachments/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}
