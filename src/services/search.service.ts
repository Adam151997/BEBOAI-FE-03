import apiClient from "@/lib/api-client";
import type { Lead, Account, Contact, Opportunity, Task, Case, Event, Document } from "@/types";

// FastAPI v2 search endpoint: /api/v2/search/
// Note: Verify if global search exists in apiv2/routers/ or if search is per-module
// 
// Endpoint:
// - GET /search/?q={query} → Global search across all modules
export interface GlobalSearchResult {
  query: string;
  leads: Lead[];
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
  tasks: Task[];
  events: Event[];
  cases: Case[];
  documents: Document[];
}

export const searchService = {
  search: async (query: string): Promise<GlobalSearchResult> => {
    const response = await apiClient.get<GlobalSearchResult>("/search/", {
      params: { q: query },
    });
    return response.data;
  },
};
