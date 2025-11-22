import { CrudService, type QueryParams } from "./crud.service";
import type { Opportunity, OpportunitiesListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

class OpportunitiesService extends CrudService<Opportunity> {
  constructor() {
    super("/opportunities/");
  }

  // Override getAll to handle the custom opportunities response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Opportunity>> {
    const response = await apiClient.get<OpportunitiesListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allOpportunities: Opportunity[] = [];
    
    // Check for nested structure
    if (data.active_opportunities || data.closed_opportunities) {
      allOpportunities = [
        ...(data.active_opportunities?.active_opportunities || data.active_opportunities?.opportunities || []),
        ...(data.closed_opportunities?.close_opportunities || data.closed_opportunities?.closed_opportunities || []),
      ];
    } else if (data.opportunities) {
      // Fallback to simple array response
      allOpportunities = data.opportunities;
    }
    
    // Transform to standard paginated response format
    return {
      count: allOpportunities.length,
      next: null,
      previous: null,
      results: allOpportunities,
    };
  }
}

export const opportunitiesService = new OpportunitiesService();
