import { CrudService, type QueryParams } from "./crud.service";
import type { Lead, LeadsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 leads router: /api/v2/leads/
// Matches apiv2/routers/leads.py
class LeadsService extends CrudService<Lead> {
  constructor() {
    super("/leads/");
  }

  // Override getAll to handle the custom leads response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Lead>> {
    const response = await apiClient.get<LeadsListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Combine open and closed leads into a single results array
    const allLeads = [
      ...(data.open_leads?.open_leads || []),
      ...(data.close_leads?.close_leads || []),
    ];
    
    // Transform to standard paginated response format
    return {
      count: (data.open_leads?.leads_count || 0) + (data.close_leads?.leads_count || 0),
      next: null, // Backend doesn't provide next/previous URLs
      previous: null,
      results: allLeads,
    };
  }

  async bulkUpload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/leads/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async createFromSite(data: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.post<Lead>("/leads/create-from-site/", data);
    return response.data;
  }
}

export const leadsService = new LeadsService();
