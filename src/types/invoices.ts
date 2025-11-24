// ========================================
// Invoice Types - Match FastAPI v2 Pydantic Schemas
// Matches apiv2/schemas/invoices.py
// ========================================

import type { UserMin, TeamMin, AccountMin, AddressMin, AttachmentResponse } from "./index";

// Invoice status enum - matches backend choices
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Cancelled" | "Overdue";

// Invoice item for line items in an invoice
// Matches InvoiceItem schema
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount?: number; // Calculated field
  tax_rate?: number;
  tax_amount?: number;
  discount_percent?: number;
  discount_amount?: number;
}

// Full invoice response from backend
// Matches apiv2/schemas/invoices.py::InvoiceResponse
export interface InvoiceResponse {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  
  // Account/Customer info
  account?: AccountMin;
  account_name?: string;
  
  // Billing address
  billing_address?: AddressMin;
  
  // Line items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  tax_total: number;
  discount_total: number;
  total_amount: number;
  amount_paid?: number;
  amount_due?: number;
  
  // Currency and payment
  currency?: string;
  payment_terms?: string;
  payment_method?: string;
  
  // Notes and references
  notes?: string;
  terms_and_conditions?: string;
  reference_number?: string;
  purchase_order_number?: string;
  
  // Metadata
  created_by?: UserMin;
  assigned_to?: UserMin[];
  teams?: TeamMin[];
  tags?: string[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Related data counts
  comments_count?: number;
  attachments_count?: number;
}

// Invoice Create Payload - Matches Backend POST /api/v2/invoices/ REQUIRED fields
export interface InvoiceCreate {
  // REQUIRED fields
  invoice_title: string;  // 1-50 chars
  name: string;  // 1-100 chars
  email: string;  // Valid email
  
  // OPTIONAL fields
  status?: string;  // Default: "Draft" - "Draft", "Sent", "Paid"
  phone?: string | null;
  due_date?: string | null;  // Format: "YYYY-MM-DD"
  currency?: string | null;
  quantity?: number;  // Default: 0
  rate?: number;  // Default: 0.00 (decimal)
  tax?: number | null;  // Decimal
  total_amount?: number | null;  // Decimal
  amount_due?: number | null;  // Decimal
  amount_paid?: number | null;  // Decimal
  is_email_sent?: boolean;  // Default: false
  details?: string | null;
  from_address?: number | null;  // Address ID
  to_address?: number | null;  // Address ID
  assigned_to?: number[];  // Array of User IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
  accounts?: number[];  // Array of Account IDs (default: [])
}

// Invoice Update Payload - Matches Backend PUT /api/v2/invoices/{id}/ - ALL fields optional
export interface InvoiceUpdate {
  invoice_title?: string;  // Must be 1-50 chars if provided
  name?: string;  // Must be 1-100 chars if provided
  email?: string;
  status?: string;
  phone?: string | null;
  due_date?: string | null;
  currency?: string | null;
  quantity?: number;
  rate?: number;
  tax?: number | null;
  total_amount?: number | null;
  amount_due?: number | null;
  amount_paid?: number | null;
  is_email_sent?: boolean;
  details?: string | null;
  from_address?: number | null;
  to_address?: number | null;
  assigned_to?: number[];
  teams?: number[];
  accounts?: number[];
}

// Invoice list response
// Matches apiv2/schemas/invoices.py::InvoiceListResponse
export interface InvoiceListResponse {
  invoices: InvoiceResponse[];
  invoices_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

// Invoice history entry
// Matches apiv2/schemas/invoices.py::InvoiceHistoryResponse
export interface InvoiceHistoryResponse {
  id: string;
  action: string;
  description?: string;
  performed_by?: UserMin;
  created_at?: string;
  changes?: Record<string, any>;
}

// Comment create payload
// Matches apiv2/schemas/invoices.py::CommentCreate
export interface InvoiceCommentCreate {
  comment: string;
}

// Attachment upload response
export interface InvoiceAttachmentResponse extends AttachmentResponse {
  invoice_id?: string;
}
