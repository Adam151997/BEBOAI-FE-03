import apiClient from "@/lib/api-client";
import type { DashboardResponse } from "@/types";

class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>("/dashboard/");
    return response.data;
  }
}

export const dashboardService = new DashboardService();
