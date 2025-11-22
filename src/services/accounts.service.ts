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
    
    // Try different possible response structures
    let allAccounts: Account[] = [];
    
    // Check for nested structure
    if (data.active_accounts || data.closed_accounts) {
      const active = data.active_accounts;
      allAccounts = [
        ...(
          (active?.open_accounts ||
           active?.active_accounts ||
           []) as Account[]
        ),
        ...(data.closed_accounts?.close_accounts || []),
      ];
    } else if (Array.isArray(data)) {
      // Fallback to simple array response
      allAccounts = data as unknown as Account[];
    }
    
    // Transform to standard paginated response format
    return {
      count: allAccounts.length,
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
