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

// ========================================
// Base CRUD Service for FastAPI v2 Endpoints
// ========================================
// This service provides standard CRUD operations that follow FastAPI v2 REST conventions:
// - GET    /{resource}/             → List all items with pagination
// - POST   /{resource}/             → Create new item
// - GET    /{resource}/{id}/        → Get single item by ID
// - PUT    /{resource}/{id}/        → Full update of item
// - PATCH  /{resource}/{id}/        → Partial update of item
// - DELETE /{resource}/{id}/        → Delete item
// - POST   /{resource}/{id}/comments/    → Add comment to item
// - POST   /{resource}/{id}/attachments/ → Add attachment to item
//
// Services can extend this class and override methods for custom behavior
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
