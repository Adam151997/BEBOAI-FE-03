import apiClient from "@/lib/api-client";
import type { Lead, Account, Contact, Opportunity, Task, Case } from "@/types";

export interface GlobalSearchResult {
  query: string;
  leads: Lead[];
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
  tasks: Task[];
  events: any[];
  cases: Case[];
  documents: any[];
}

export const searchService = {
  search: async (query: string): Promise<GlobalSearchResult> => {
    const response = await apiClient.get<GlobalSearchResult>("/search/", {
      params: { q: query },
    });
    return response.data;
  },
};
