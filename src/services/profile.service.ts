import apiClient from "@/lib/api-client";

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_organization_admin: boolean;
  phone?: string;
  address_line?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export const profileService = {
  getCurrentProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile>("/profile/me/");
    return response.data;
  },

  updateCurrentProfile: async (data: Partial<Profile>): Promise<Profile> => {
    const response = await apiClient.put<Profile>("/profile/me/", data);
    return response.data;
  },
};
