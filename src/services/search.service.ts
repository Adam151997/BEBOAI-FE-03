import apiClient from "@/lib/api-client";
import type { Lead, Account, Contact, Opportunity, Task, Case, Event, Document } from "@/types";

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
