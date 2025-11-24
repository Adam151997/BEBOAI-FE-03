import apiClient from "@/lib/api-client";
import type { DashboardResponse } from "@/types";

// ========================================
// FastAPI v2 DASHBOARD ENDPOINT
// ========================================
// Dashboard endpoint now uses FastAPI v2 /api/v2/dashboard route
// Matches apiv2/routers/dashboard.py
//
// Endpoint:
// - GET /api/v2/dashboard/ → Returns aggregated dashboard data
//   (accounts, contacts, leads, opportunities with filtering by user permissions)
//
class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    // Using FastAPI v2 dashboard endpoint
    const response = await apiClient.get<DashboardResponse>("/dashboard/");
    return response.data;
  }
}

export const dashboardService = new DashboardService();
