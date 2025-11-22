import apiClient from "@/lib/api-client";
import type { LoginResponse, User } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login/", {
      email,
      password,
    });

    // Store tokens and org data
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("org_key", response.data.org.id);
    localStorage.setItem("org", JSON.stringify(response.data.org));
    localStorage.setItem("user", JSON.stringify(response.data.user_details));

    return response.data;
  },

  logout: () => {
    localStorage.clear();
    window.location.href = "/login";
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>("/auth/refresh-token/", {
      refresh: refreshToken,
    });
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },
};
