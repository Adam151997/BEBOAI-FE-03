import apiClient from "@/lib/api-client";
import type { LoginResponse, User } from "@/types";

// ========================================
// FastAPI v2 AUTH ENDPOINTS
// ========================================
// Auth endpoints now use FastAPI v2 /api/v2/auth routes
// Matches apiv2/routers/auth.py
//
// Endpoints:
// - POST /api/v2/auth/login/       → User login (returns access + refresh tokens)
// - POST /api/v2/auth/register/    → User registration (if available)
// - POST /api/v2/auth/refresh-token/ → Token refresh (if available)
// - POST /api/v2/auth/google       → Google OAuth login
//
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Using FastAPI v2 auth endpoint
    const response = await apiClient.post<LoginResponse>(
      "/auth/login/",
      { email, password }
    );

    // Store tokens (backend uses access and refresh fields)
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    // Get org from nested user_details.org (new backend structure)
    const org = response.data.user_details.org || response.data.org;
    if (org) {
      // FastAPI v2 requires org header to be the organization UUID (org.id), not the API key
      localStorage.setItem("org_id", org.id);
      // Keep org_api_key separate if needed for display purposes
      if (org.api_key) {
        localStorage.setItem("org_api_key", org.api_key);
      }
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
    // Using FastAPI v2 auth endpoint
    const response = await apiClient.post<{ access: string }>(
      "/auth/refresh-token/",
      { refresh: refreshToken }
    );
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },

  register: async (
    org_name: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ): Promise<LoginResponse> => {
    // Using FastAPI v2 auth endpoint
    const response = await apiClient.post<LoginResponse>(
      "/auth/register/",
      { org_name, email, password, first_name, last_name }
    );

    // Store tokens (backend uses access and refresh fields)
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    // Get org from nested user_details.org (new backend structure)
    const org = response.data.user_details.org || response.data.org;
    if (org) {
      // FastAPI v2 requires org header to be the organization UUID (org.id), not the API key
      localStorage.setItem("org_id", org.id);
      // Keep org_api_key separate if needed for display purposes
      if (org.api_key) {
        localStorage.setItem("org_api_key", org.api_key);
      }
      localStorage.setItem("org", JSON.stringify(org));
    }

    // Store user details
    localStorage.setItem("user", JSON.stringify(response.data.user_details));

    // Store profile_id for easy access (critical for assigned_to arrays)
    const profileId = response.data.user_details.profile_id || response.data.user_details.id;
    localStorage.setItem("profile_id", profileId);

    console.log("✅ Registration successful - stored:", {
      profile_id: profileId,
      org_id: org?.id,
      role: response.data.user_details.role
    });

    return response.data;
  },
};
