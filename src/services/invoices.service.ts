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

// FastAPI v2 invoices router: /api/v2/invoices/
// Matches apiv2/routers/invoices.py and apiv2/schemas/invoices.py
class InvoicesService {
  private endpoint = "/invoices/";

  // Get all invoices with pagination
  async getAll(params?: QueryParams): Promise<PaginatedResponse<InvoiceResponse>> {
    const response = await apiClient.get<InvoiceListResponse>(this.endpoint, {
      params,
    });

    const data = response.data;

    // Transform FastAPI v2 response to standard paginated format for component compatibility
    return {
      count: data.invoices_count || 0,
      next: null,
      previous: null,
      results: data.invoices || [],
    };
  }

  // Get a single invoice by ID
  async getOne(id: string): Promise<InvoiceResponse> {
    const response = await apiClient.get<InvoiceResponse>(`${this.endpoint}${id}/`);
    return response.data;
  }

  // Create a new invoice
  async create(data: InvoiceCreate): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(this.endpoint, data);
    return response.data;
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
