import apiClient, { LEGACY_API_BASE_URL } from "@/lib/api-client";
import type { LoginResponse, User } from "@/types";

// ========================================
// LEGACY AUTH ENDPOINTS - NOT MIGRATED TO FastAPI v2 YET
// ========================================
// Auth endpoints still use legacy DRF /api routes, not /api/v2
// These endpoints work correctly and will be migrated to FastAPI v2 in a future update
// 
// Current endpoints:
// - POST /api/auth/login/          → User login (returns access + refresh tokens)
// - POST /api/auth/register/       → User registration
// - POST /api/auth/refresh-token/  → Token refresh (also used in api-client.ts interceptor)
//
// These services bypass the /api/v2 baseURL by using explicit LEGACY_API_BASE_URL
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Auth endpoints still use legacy /api, not /api/v2
    const response = await apiClient.post<LoginResponse>(
      `${LEGACY_API_BASE_URL}/auth/login/`,
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
    // Token refresh still uses legacy /api endpoint
    const response = await apiClient.post<{ access: string }>(
      `${LEGACY_API_BASE_URL}/auth/refresh-token/`,
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
    // Registration still uses legacy /api endpoint
    const response = await apiClient.post<LoginResponse>(
      `${LEGACY_API_BASE_URL}/auth/register/`,
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
