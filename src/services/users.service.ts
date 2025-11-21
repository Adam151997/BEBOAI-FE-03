import apiClient from "@/lib/api-client";
import { User, PaginatedResponse } from "@/types";

export const usersService = {
  getAll: async (params?: any): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>("/users/", {
      params,
    });
    return response.data;
  },

  getOne: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${id}/`);
    return response.data;
  },

  create: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.post<User>("/users/", data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/user/${id}/`, data);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean): Promise<User> => {
    const response = await apiClient.post<User>(`/user/${id}/status/`, {
      is_active: isActive,
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/profile/");
    return response.data;
  },

  getTeamsAndUsers: async (): Promise<{ teams: any[]; users: User[] }> => {
    const response = await apiClient.get("/users/get-teams-and-users/");
    return response.data;
  },
};
