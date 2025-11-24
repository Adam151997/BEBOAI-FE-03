import apiClient from "@/lib/api-client";
import type { QueryParams } from "./crud.service";
import type {
  InvoiceResponse,
  InvoiceCreate,
  InvoiceUpdate,
  InvoiceListResponse,
  InvoiceHistoryResponse,
  InvoiceCommentCreate,
  InvoiceAttachmentResponse,
  InvoiceStatus,
} from "@/types/invoices";
import type { PaginatedResponse, CommentResponse } from "@/types";
import { AxiosError } from "axios";

// FastAPI v2 invoices router: /api/v2/invoices/
// Matches apiv2/routers/invoices.py and apiv2/schemas/invoices.py
// 
// INVESTIGATION (2025-11-24): Backend returns 400 "Missing org_id in token"
// This error specifically mentions the JWT token is missing org_id claim.
// 
// Debugging steps implemented:
// 1. Log the actual JWT token structure (decoded)
// 2. Log all request headers being sent
// 3. Compare with working modules (accounts, leads) to ensure consistency
// 4. Verify Authorization header and org header are properly set
// 
// The invoices service uses the same apiClient as all other modules, which should
// automatically add Authorization and org headers via the request interceptor.
// If this specific module is failing, it suggests the token itself may not contain
// the org_id claim, or there's a timing issue with token refresh.
class InvoicesService {
  private endpoint = "/invoices/";

  // Get all invoices with pagination
  async getAll(params?: QueryParams): Promise<PaginatedResponse<InvoiceResponse>> {
    try {
      // Enhanced logging for debugging the 400 error (development only)
      if (import.meta.env.DEV) {
        const fullUrl = apiClient.defaults.baseURL + this.endpoint;
        console.log('[Invoices Service] Fetching invoices from:', fullUrl);
        console.log('[Invoices Service] Request params:', params);
        
        // Log token and org context (without exposing sensitive data)
        const token = localStorage.getItem('access_token');
        const orgId = localStorage.getItem('org_id');
        const orgApiKey = localStorage.getItem('org_api_key');
        
        console.log('[Invoices Service] Auth context:', {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          hasOrgId: !!orgId,
          orgId: orgId || 'MISSING',
          hasOrgApiKey: !!orgApiKey,
        });

        // Try to decode JWT token to see its structure (development only)
        // This helps diagnose if the token contains the required org_id claim
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('[Invoices Service] JWT Token payload structure:', {
                hasExp: 'exp' in payload,
                hasUserId: 'user_id' in payload || 'sub' in payload,
                hasOrgId: 'org_id' in payload,
                claimKeys: Object.keys(payload),
              });
              
              // Highlight the org_id issue if missing
              if (!('org_id' in payload)) {
                console.error('[Invoices Service] JWT token is missing org_id claim - This is the root cause!');
              }
            }
          } catch (decodeError) {
            console.error('[Invoices Service] Could not decode JWT token - may be malformed');
          }
        }
      }

      const response = await apiClient.get<InvoiceListResponse>(this.endpoint, {
        params,
      });

      if (import.meta.env.DEV) {
        console.log('[Invoices Service] Response status:', response.status);
        console.log('[Invoices Service] Response data structure:', Object.keys(response.data));
      }

      const data = response.data;

      // Transform FastAPI v2 response to standard paginated format for component compatibility
      return {
        count: data.invoices_count || 0,
        next: null,
        previous: null,
        results: data.invoices || [],
      };
    } catch (error) {
      // Enhanced error logging for the 400 "Missing org_id" error
      if (error instanceof AxiosError) {
        console.error('[Invoices Service] API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullUrl: (error.config?.baseURL || '') + (error.config?.url || ''),
          method: error.config?.method?.toUpperCase(),
          responseData: error.response?.data,
        });

        // Log header presence without exposing values
        console.error('[Invoices Service] Request headers status:', {
          hasAuthHeader: !!error.config?.headers?.Authorization,
          hasOrgHeader: !!error.config?.headers?.org,
        });

        // Specific handling for the 400 org_id error
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.detail || error.response?.data?.message || '';
          if (errorMessage.includes('org_id')) {
            console.error('[Invoices Service] 400 Error: Missing org_id in token.');
            console.error('[Invoices Service] This indicates the JWT token does not contain the org_id claim.');
            console.error('[Invoices Service] User may need to re-authenticate to get a token with org_id.');
            console.error('[Invoices Service] Check if other modules (accounts, leads) are working correctly.');
          }
        }
      } else {
        console.error('[Invoices Service] Unexpected error:', error);
      }
      
      // Re-throw the error so the UI can handle it
      throw error;
    }
  }

  // Get a single invoice by ID
  async getOne(id: string): Promise<InvoiceResponse> {
    try {
      if (import.meta.env.DEV) {
        console.log('[Invoices Service] Fetching invoice:', id);
      }
      const response = await apiClient.get<InvoiceResponse>(`${this.endpoint}${id}/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('[Invoices Service] getOne Error:', {
          status: error.response?.status,
          invoiceId: id,
          responseData: error.response?.data,
        });
      }
      throw error;
    }
  }

  // Create a new invoice
  async create(data: InvoiceCreate): Promise<InvoiceResponse> {
    try {
      if (import.meta.env.DEV) {
        console.log('[Invoices Service] Creating invoice:', {
          invoice_title: data.invoice_title,
          name: data.name,
          email: data.email,
        });
      }
      const response = await apiClient.post<InvoiceResponse>(this.endpoint, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('[Invoices Service] create Error:', {
          status: error.response?.status,
          responseData: error.response?.data,
        });
      }
      throw error;
    }
  }

  // Update an existing invoice (full update)
  async update(id: string, data: InvoiceUpdate): Promise<InvoiceResponse> {
    const response = await apiClient.put<InvoiceResponse>(
      `${this.endpoint}${id}/`,
      data
    );
    return response.data;
  }

  // Partial update of an invoice
  async partialUpdate(id: string, data: Partial<InvoiceUpdate>): Promise<InvoiceResponse> {
    const response = await apiClient.patch<InvoiceResponse>(
      `${this.endpoint}${id}/`,
      data
    );
    return response.data;
  }

  // Delete an invoice
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}${id}/`);
  }

  // Get invoice history
  async getHistory(id: string): Promise<InvoiceHistoryResponse[]> {
    const response = await apiClient.get<InvoiceHistoryResponse[]>(
      `${this.endpoint}${id}/history/`
    );
    return response.data;
  }

  // Add a comment to an invoice
  async addComment(id: string, comment: string): Promise<CommentResponse> {
    const payload: InvoiceCommentCreate = { comment };
    const response = await apiClient.post<CommentResponse>(
      `${this.endpoint}${id}/comments/`,
      payload
    );
    return response.data;
  }

  // Get comments for an invoice
  async getComments(id: string): Promise<CommentResponse[]> {
    const response = await apiClient.get<CommentResponse[]>(
      `${this.endpoint}${id}/comments/`
    );
    return response.data;
  }

  // Add an attachment to an invoice
  async addAttachment(id: string, file: File): Promise<InvoiceAttachmentResponse> {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await apiClient.post<InvoiceAttachmentResponse>(
      `${this.endpoint}${id}/attachments/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Get attachments for an invoice
  async getAttachments(id: string): Promise<InvoiceAttachmentResponse[]> {
    const response = await apiClient.get<InvoiceAttachmentResponse[]>(
      `${this.endpoint}${id}/attachments/`
    );
    return response.data;
  }

  // Update invoice status
  async updateStatus(id: string, status: InvoiceStatus): Promise<InvoiceResponse> {
    const response = await apiClient.patch<InvoiceResponse>(
      `${this.endpoint}${id}/`,
      { status }
    );
    return response.data;
  }

  // Mark invoice as paid
  async markAsPaid(id: string, amount_paid?: number): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(
      `${this.endpoint}${id}/mark-paid/`,
      { amount_paid }
    );
    return response.data;
  }

  // Send invoice (if backend supports this endpoint)
  async sendInvoice(id: string, recipientEmail?: string): Promise<any> {
    const response = await apiClient.post(
      `${this.endpoint}${id}/send/`,
      { recipient_email: recipientEmail }
    );
    return response.data;
  }
}

export const invoicesService = new InvoicesService();
