import apiClient from "@/lib/api-client";

export interface SearchResult {
  module: string;
  id: string;
  name?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  results: SearchResult[];
  count: number;
}

export const searchService = {
  search: async (query: string): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>("/search/", {
      params: { q: query },
    });
    return response.data;
  },
};
