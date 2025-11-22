import apiClient from "@/lib/api-client";
import type { LoginResponse, User } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login/", {
      email,
      password,
    });

    // Store tokens (new backend uses access_token and refresh_token)
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    // Get org from nested user_details.org (new backend structure)
    const org = response.data.user_details.org || response.data.org;
    if (org) {
      localStorage.setItem("org_key", org.id);
      localStorage.setItem("org", JSON.stringify(org));
    }

    // Store user details
    localStorage.setItem("user", JSON.stringify(response.data.user_details));

    // Store profile_id for easy access (critical for assigned_to arrays)
    const profileId = response.data.user_details.profile_id || response.data.user_details.id;
    localStorage.setItem("profile_id", profileId);

    console.log("✅ Login successful - stored:", {
      profile_id: profileId,
      org_id: org?.id,
      role: response.data.user_details.role
    });

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
