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

// Invoice create payload
// Matches apiv2/schemas/invoices.py::InvoiceCreate
export interface InvoiceCreate {
  invoice_number?: string; // May be auto-generated
  invoice_date: string;
  due_date: string;
  status?: InvoiceStatus;
  
  account?: string; // Account ID
  account_name?: string;
  
  billing_address?: Partial<AddressMin>;
  
  items: Omit<InvoiceItem, "id" | "amount" | "tax_amount">[];
  
  subtotal?: number; // May be calculated
  tax_total?: number;
  discount_total?: number;
  total_amount?: number;
  
  currency?: string;
  payment_terms?: string;
  payment_method?: string;
  
  notes?: string;
  terms_and_conditions?: string;
  reference_number?: string;
  purchase_order_number?: string;
  
  assigned_to?: string[];
  teams?: string[];
  tags?: string[];
}

// Invoice update payload
// Matches apiv2/schemas/invoices.py::InvoiceUpdate
export interface InvoiceUpdate {
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  status?: InvoiceStatus;
  
  account?: string;
  account_name?: string;
  
  billing_address?: Partial<AddressMin>;
  
  items?: Omit<InvoiceItem, "id" | "amount" | "tax_amount">[];
  
  subtotal?: number;
  tax_total?: number;
  discount_total?: number;
  total_amount?: number;
  amount_paid?: number;
  
  currency?: string;
  payment_terms?: string;
  payment_method?: string;
  
  notes?: string;
  terms_and_conditions?: string;
  reference_number?: string;
  purchase_order_number?: string;
  
  assigned_to?: string[];
  teams?: string[];
  tags?: string[];
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
