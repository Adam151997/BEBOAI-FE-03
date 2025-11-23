import { CrudService, type QueryParams } from "./crud.service";
import type { Case, CasesListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 cases router: /api/v2/cases/
// Matches apiv2/routers/cases.py
class CasesService extends CrudService<Case> {
  constructor() {
    super("/cases/");
  }

  // Override getAll to handle the custom cases response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Case>> {
    const response = await apiClient.get<CasesListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allCases: Case[] = [];
    
    // Check for nested structure
    if (data.active_cases || data.closed_cases) {
      allCases = [
        ...(data.active_cases?.active_cases || data.active_cases?.cases || []),
        ...(data.closed_cases?.close_cases || data.closed_cases?.closed_cases || []),
      ];
    } else if (data.cases) {
      // Fallback to simple array response
      allCases = data.cases;
    }
    
    // Transform to standard paginated response format
    return {
      count: allCases.length,
      next: null,
      previous: null,
      results: allCases,
    };
  }
}

export const casesService = new CasesService();
