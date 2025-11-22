import { create } from "zustand";
import type { User, Organization } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setOrganization: (org) => set({ organization: org }),

  login: async (email: string, password: string) => {
    const data = await authService.login(email, password);
    set({
      user: data.user_details,
      organization: data.org,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  logout: () => {
    authService.logout();
    set({ user: null, organization: null, isAuthenticated: false, isInitialized: true });
  },

  initializeAuth: () => {
    const user = authService.getCurrentUser();
    const orgStr = localStorage.getItem("org");
    const org = orgStr ? JSON.parse(orgStr) : null;

    set({
      user,
      organization: org,
      isAuthenticated: authService.isAuthenticated(),
      isInitialized: true,
    });
  },
}));
