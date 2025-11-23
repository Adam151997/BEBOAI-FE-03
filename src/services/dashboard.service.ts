import axios from "axios";
import { LEGACY_API_BASE_URL } from "@/lib/api-client";
import type { DashboardResponse } from "@/types";

// ========================================
// LEGACY DASHBOARD ENDPOINT - NOT MIGRATED TO FastAPI v2 YET
// ========================================
// Dashboard endpoint still uses legacy DRF /api route, not /api/v2
// This endpoint works correctly and will be migrated to FastAPI v2 in a future update
// 
// Current endpoint:
// - GET /api/dashboard/ → Returns aggregated dashboard data
//
// This service bypasses the /api/v2 baseURL by using absolute URL with LEGACY_API_BASE_URL
// and manually adding auth headers (org and Authorization)
class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    // Dashboard endpoint still uses legacy /api (not migrated to FastAPI v2 yet)
    // Using absolute URL to bypass the /api/v2 baseURL in apiClient
    const token = localStorage.getItem("access_token");
    const orgId = localStorage.getItem("org_id");
    
    const response = await axios.get<DashboardResponse>(
      `${LEGACY_API_BASE_URL}/dashboard/`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(orgId && { org: orgId }),
        }
      }
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();
