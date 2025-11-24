import { CrudService, type QueryParams } from "./crud.service";
import type { Account, AccountCreate, AccountUpdate, AccountsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 accounts router: /api/v2/accounts/
// Matches apiv2/routers/accounts.py and apiv2/schemas/accounts.py
// 
// FIX: Updated to use backend API endpoint /api/v2/accounts/ instead of frontend route /accounts
// The apiClient baseURL (https://beboai-03-production.up.railway.app/api/v2) is prepended to the relative path
// This ensures we fetch from the backend API and not the frontend React Router route
//
// Standard CRUD endpoints (full paths):
// - GET    /api/v2/accounts/                  → List accounts with pagination
// - POST   /api/v2/accounts/                  → Create new account
// - GET    /api/v2/accounts/{id}/             → Get single account
// - PUT    /api/v2/accounts/{id}/             → Update account
// - PATCH  /api/v2/accounts/{id}/             → Partial update
// - DELETE /api/v2/accounts/{id}/             → Delete account
// - POST   /api/v2/accounts/{id}/comments/    → Add comment
// - POST   /api/v2/accounts/{id}/attachments/ → Add attachment
//
// Additional endpoints:
// - POST   /api/v2/accounts/{id}/create_mail/ → Send email to account
class AccountsService extends CrudService<Account, AccountCreate, AccountUpdate> {
  constructor() {
    // Using relative path "/accounts/" which gets prepended with apiClient baseURL ("/api/v2")
    // to form the complete backend API endpoint: /api/v2/accounts/
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
    // Uses backend API endpoint: /api/v2/accounts/{id}/create_mail/
    const response = await apiClient.post(`/accounts/${id}/create_mail/`, mailData);
    return response.data;
  }
}

export const accountsService = new AccountsService();
