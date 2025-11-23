import { CrudService, type QueryParams } from "./crud.service";
import type { Team, TeamsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 teams router: /api/v2/teams/
// Matches apiv2/routers/teams.py and apiv2/schemas/teams.py
// 
// Standard CRUD endpoints:
// - GET    /teams/                  → List teams with pagination
// - POST   /teams/                  → Create new team
// - GET    /teams/{id}/             → Get single team
// - PUT    /teams/{id}/             → Update team
// - PATCH  /teams/{id}/             → Partial update
// - DELETE /teams/{id}/             → Delete team
// - POST   /teams/{id}/comments/    → Add comment (if supported)
// - POST   /teams/{id}/attachments/ → Add attachment (if supported)
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
