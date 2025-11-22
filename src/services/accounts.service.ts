import { CrudService, type QueryParams } from "./crud.service";
import type { Account, AccountsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

class AccountsService extends CrudService<Account> {
  constructor() {
    super("/accounts/");
  }

  // Override getAll to handle the custom accounts response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Account>> {
    const response = await apiClient.get<AccountsListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Combine active and closed accounts into a single results array
    const allAccounts = [
      ...(data.active_accounts?.active_accounts || []),
      ...(data.closed_accounts?.close_accounts || []),
    ];
    
    // Transform to standard paginated response format
    return {
      count: (data.active_accounts?.accounts_count || 0) + (data.closed_accounts?.accounts_count || 0),
      next: null, // Backend doesn't provide next/previous URLs
      previous: null,
      results: allAccounts,
    };
  }

  async createMail(id: string, mailData: any): Promise<any> {
    const response = await apiClient.post(`/accounts/${id}/create_mail/`, mailData);
    return response.data;
  }
}

export const accountsService = new AccountsService();
