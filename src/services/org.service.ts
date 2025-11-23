import apiClient from "@/lib/api-client";
import type { Organization } from "@/types";

// FastAPI v2 org router: /api/v2/org/
// Matches apiv2/routers/org.py and apiv2/schemas/org.py
// 
// Organization management endpoints:
// - GET    /org/              → Get current organization details
// - PUT    /org/              → Update organization details
// - PATCH  /org/              → Partial update organization
// - GET    /org/settings/     → Get organization settings
// - PUT    /org/settings/     → Update organization settings
// - GET    /org/members/      → List organization members
// - POST   /org/members/      → Invite new member
// - DELETE /org/members/{id}/ → Remove member

export interface OrgSettings {
  timezone?: string;
  currency?: string;
  date_format?: string;
  time_format?: string;
  language?: string;
  [key: string]: any;
}

export interface OrgMember {
  id: string;
  user_id: string;
  email: string;
  role: string;
  is_active: boolean;
  joined_at?: string;
}

export const orgService = {
  // Get current organization
  getOrg: async (): Promise<Organization> => {
    const response = await apiClient.get<Organization>("/org/");
    return response.data;
  },

  // Update organization
  updateOrg: async (data: Partial<Organization>): Promise<Organization> => {
    const response = await apiClient.put<Organization>("/org/", data);
    return response.data;
  },

  // Partial update organization
  partialUpdateOrg: async (data: Partial<Organization>): Promise<Organization> => {
    const response = await apiClient.patch<Organization>("/org/", data);
    return response.data;
  },

  // Get organization settings
  getSettings: async (): Promise<OrgSettings> => {
    const response = await apiClient.get<OrgSettings>("/org/settings/");
    return response.data;
  },

  // Update organization settings
  updateSettings: async (settings: Partial<OrgSettings>): Promise<OrgSettings> => {
    const response = await apiClient.put<OrgSettings>("/org/settings/", settings);
    return response.data;
  },

  // List organization members
  getMembers: async (): Promise<OrgMember[]> => {
    const response = await apiClient.get<OrgMember[]>("/org/members/");
    return response.data;
  },

  // Invite new member
  inviteMember: async (email: string, role: string): Promise<OrgMember> => {
    const response = await apiClient.post<OrgMember>("/org/members/", {
      email,
      role,
    });
    return response.data;
  },

  // Remove member
  removeMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/org/members/${memberId}/`);
  },
};
