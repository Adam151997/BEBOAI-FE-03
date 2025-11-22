import { CrudService, type QueryParams } from "./crud.service";
import type { Team, TeamsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

class TeamsService extends CrudService<Team> {
  constructor() {
    super("/teams/");
  }

  // Override getAll to handle the custom teams response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Team>> {
    const response = await apiClient.get<TeamsListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allTeams: Team[] = [];
    
    // Check for nested structure
    if (data.active_teams) {
      allTeams = data.active_teams?.active_teams || data.active_teams?.teams || [];
    } else if (data.teams) {
      // Fallback to simple array response
      allTeams = data.teams;
    }
    
    // Transform to standard paginated response format
    return {
      count: allTeams.length,
      next: null,
      previous: null,
      results: allTeams,
    };
  }
}

export const teamsService = new TeamsService();
