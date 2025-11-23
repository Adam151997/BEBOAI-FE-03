// ========================================
// FastAPI v2 Types - Match Pydantic Schemas
// ========================================

// Minimal nested model types used across FastAPI v2 responses
// Matches apiv2/schemas/* minimal models

export interface UserMin {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface ProfileMin {
  id: string;
  user?: UserMin;
}

export interface TeamMin {
  id: string;
  name: string;
}

export interface OrgMin {
  id: string;
  name: string;
}

export interface AddressMin {
  address_line?: string;
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface AccountMin {
  id: string;
  name: string;
}

// Comment and Attachment types for FastAPI v2
// Matches apiv2/schemas/contacts.py::CommentResponse, AttachmentResponse, etc.
export interface CommentResponse {
  id: string;
  comment: string;
  commented_by?: UserMin;
  created_at?: string;
}

export interface AttachmentResponse {
  id: string;
  file_name?: string;
  file_url?: string;
  uploaded_by?: UserMin;
  created_at?: string;
}

// FastAPI v2 List Response Types
// These match the exact Pydantic *ListResponse schemas in apiv2/schemas/*

// Matches apiv2/schemas/contacts.py::ContactListResponse
export interface ContactListResponseV2 {
  contact_obj_list: Contact[];
  contacts_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

// Matches apiv2/schemas/teams.py::TeamListResponse
export interface TeamListResponseV2 {
  teams: Team[];
  teams_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

// Matches apiv2/schemas/invoices.py::InvoiceListResponse
export interface InvoiceListResponseV2 {
  invoices: Invoice[];
  invoices_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

// Placeholder for Invoice type (to be implemented when invoice module is added)
export interface Invoice {
  id: string;
  // Add invoice fields based on apiv2/schemas/invoices.py when implementing
}

// Matches pattern for other FastAPI v2 list responses
export interface LeadListResponseV2 {
  leads: Lead[];
  leads_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

export interface UserListResponseV2 {
  users: User[];
  users_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

export interface CaseListResponseV2 {
  cases: Case[];
  cases_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

export interface TaskListResponseV2 {
  tasks: Task[];
  tasks_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

// ========================================
// Legacy Types (DRF-style)
// ========================================

// User and Auth Types
export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  profile_id?: string;
  is_organization_admin?: boolean;
  is_active?: boolean;
  profile_pic?: string | null;
  org?: Organization;  // Nested org object from backend
  phone?: string;
  has_sales_access?: boolean;
  has_marketing_access?: boolean;
  address_line?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  first_name?: string;
  last_name?: string;
}

export interface Organization {
  id: string;
  name: string;
  api_key?: string;  // Optional - new backend may not include this
}

export interface LoginResponse {
  username?: string;  // New backend includes this
  access: string;  // Primary JWT access token field (backend returns this)
  refresh: string;  // Primary JWT refresh token field (backend returns this)
  access_token?: string;  // Deprecated - kept for backward compatibility
  refresh_token?: string;  // Deprecated - kept for backward compatibility
  user_details: User;
  org?: Organization;  // Top-level org is now optional (nested in user_details)
}

// Lead Types
export interface Lead {
  id: string;
  title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status?: "assigned" | "in process" | "converted" | "recycled" | "closed";
  source?: string;
  company?: string;  // UUID reference to Account when sent to backend
  website?: string;
  address_line?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  description?: string;
  probability?: number;  // Required by backend for Lead create/update
  assigned_to?: string[] | User[];  // Can be array of IDs or User objects
  teams?: string[];
  contacts?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Account Types
export interface Account {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  industry?: string;
  website?: string;
  status?: "open" | "close";
  contact_name?: string;  // Required by backend
  billing_address_line?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  description?: string;
  contacts?: string[];
  assigned_to?: string[] | User[];
  teams?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Contact Types
export interface Contact {
  id: string;
  salutation?: string;
  first_name: string;
  last_name?: string;
  organization?: string;
  title?: string;
  primary_email?: string;
  secondary_email?: string;
  mobile_number?: string;
  secondary_number?: string;
  department?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  description?: string;
  linked_in_url?: string;
  facebook_url?: string;
  twitter_username?: string;
  account?: Account | string | null;
  assigned_to?: string[] | User[];
  teams?: string[];
  created_at?: string;
  updated_at?: string;
  // Backwards compatibility
  email?: string;
  phone?: string;
  address_line?: string;
}

// Opportunity Types
export interface Opportunity {
  id: string;
  name: string;
  account?: string | number;
  stage?: "QUALIFICATION" | "NEEDS ANALYSIS" | "VALUE PROPOSITION" | "ID. DECISION MAKERS" | "PERCEPTION ANALYSIS" | "PROPOSAL/PRICE QUOTE" | "NEGOTIATION/REVIEW" | "CLOSED WON" | "CLOSED LOST";
  amount?: number;
  currency?: "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "JPY";
  probability?: number;
  close_date?: string;
  lead_source?: string;
  description?: string;
  assigned_to?: string[] | User[];
  teams?: string[];
  contacts?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  status?: "New" | "In Progress" | "Completed";
  priority?: "Low" | "Medium" | "High";
  due_date?: string;
  description?: string;
  account?: string;
  contact?: string;
  assigned_to?: string[] | User[];
  teams?: string[];
  contacts?: string[];
  created_at?: string;
  updated_at?: string;
}

// Event Types
export interface Event {
  id: string;
  name: string;
  event_type: "Call" | "Meeting" | "Task" | "Email";
  status?: "Planned" | "Held" | "Not Held" | "Not Started" | "Started" | "Completed" | "Cancelled" | "Deferred";
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  recurring_days?: string[];
  description?: string;
  is_recurring?: boolean;
  contacts?: string | string[];  // Can be single ID or array
  assigned_to?: string[] | User[];
  teams?: string[];
  created_at?: string;
  updated_at?: string;
}

// Case Types
export interface Case {
  id: string;
  name: string;
  status?: "New" | "Working" | "Closed" | "Rejected" | "Duplicate";
  priority?: "Low" | "Medium" | "High";
  case_type?: "Problem" | "Feature Request" | "Data Corrupted" | "Functionality Request" | "Integration" | "Others";
  description?: string;
  account?: string;
  contacts?: string[];
  assigned_to?: string[] | User[];
  teams?: string[];
  closed_on?: string;
  created_at?: string;
  updated_at?: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  users?: User[];
  created_at?: string;
  updated_at?: string;
}

// Document Types
export interface Document {
  id: string;
  title?: string;
  document_file?: string;
  created_at?: string;
  updated_at?: string;
}

// Comment Types (Legacy - use CommentResponse for FastAPI v2)
export interface Comment {
  id: string;
  comment: string;
  commented_by?: User;
  created_at?: string;
}

// Attachment Types (Legacy - use AttachmentResponse for FastAPI v2)
export interface Attachment {
  id: string;
  file_name?: string;
  file_url?: string;
  uploaded_by?: User;
  created_at?: string;
}

// Dashboard Types
export interface DashboardResponse {
  accounts_count: number;
  contacts_count: number;
  leads_count: number;
  opportunities_count: number;
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
  opportunities: Opportunity[];
}

// API Response Types (Legacy DRF-style)
// Note: Services transform backend responses to this format for backward compatibility
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ========================================
// Legacy List Response Types
// These represent the current backend response shapes (pre-FastAPI v2 or mixed)
// Services use these types and transform them to PaginatedResponse<T> for components
// ========================================

// Leads List Response (specific backend shape)
export interface LeadsListResponse {
  per_page: number;
  page_number: number | number[];  // Can be single number or array
  open_leads: {
    leads_count: number;
    open_leads: Lead[];
    offset: number | null;
  };
  close_leads: {
    leads_count: number;
    close_leads: Lead[];
    offset: number;
  };
  companies: Account[];
  contacts: Contact[];
  countries: string[];
  industries: string[];
  source: string[];
  status: string[];
  tags: string[];
  users: User[];
}

// Accounts List Response (specific backend shape)
export interface AccountsListResponse {
  per_page: number;
  page_number: number[];
  active_accounts: {
    accounts_count?: number;
    active_accounts?: Account[];
    open_accounts?: Account[];  // Backend uses this key
    offset: number | null;
  };
  closed_accounts: {
    accounts_count?: number;
    close_accounts: Account[];
    offset: number | null;
  };
  contacts: Contact[];
  countries: [string, string][];
  industries: [string, string][];
  leads: Lead[];
  status: string[];
  tags: string[];
  teams: Team[];
  users: any[];
}

// Contacts List Response (specific backend shape)
export interface ContactsListResponse {
  per_page: number;
  page_number: number[];
  active_contacts?: {
    contacts_count?: number;
    active_contacts?: Contact[];
    contacts?: Contact[];
    offset: number | null;
  };
  closed_contacts?: {
    contacts_count?: number;
    close_contacts?: Contact[];
    closed_contacts?: Contact[];
    offset: number | null;
  };
  // Fallback for simple array response
  contacts?: Contact[];
  accounts?: Account[];
  leads?: Lead[];
  countries?: [string, string][];
  status?: string[];
  tags?: string[];
  teams?: Team[];
  users?: any[];
}

// Opportunities List Response (specific backend shape)
export interface OpportunitiesListResponse {
  per_page: number;
  page_number: number[];
  active_opportunities?: {
    opportunities_count?: number;
    active_opportunities?: Opportunity[];
    opportunities?: Opportunity[];
    offset: number | null;
  };
  closed_opportunities?: {
    opportunities_count?: number;
    close_opportunities?: Opportunity[];
    closed_opportunities?: Opportunity[];
    offset: number | null;
  };
  // Fallback for simple array response
  opportunities?: Opportunity[];
  accounts?: Account[];
  contacts?: Contact[];
  stages?: string[];
  currencies?: string[];
  status?: string[];
  tags?: string[];
  teams?: Team[];
  users?: any[];
}

// Tasks List Response (specific backend shape)
export interface TasksListResponse {
  per_page: number;
  page_number: number[];
  active_tasks?: {
    tasks_count?: number;
    active_tasks?: Task[];
    tasks?: Task[];
    offset: number | null;
  };
  completed_tasks?: {
    tasks_count?: number;
    completed_tasks?: Task[];
    offset: number | null;
  };
  // Fallback for simple array response
  tasks?: Task[];
  accounts?: Account[];
  contacts?: Contact[];
  status?: string[];
  priority?: string[];
  tags?: string[];
  teams?: Team[];
  users?: any[];
}

// Events List Response (specific backend shape)
export interface EventsListResponse {
  per_page: number;
  page_number: number[];
  active_events?: {
    events_count?: number;
    active_events?: Event[];
    events?: Event[];
    offset: number | null;
  };
  completed_events?: {
    events_count?: number;
    completed_events?: Event[];
    offset: number | null;
  };
  // Fallback for simple array response
  events?: Event[];
  contacts?: Contact[];
  event_types?: string[];
  status?: string[];
  tags?: string[];
  teams?: Team[];
  users?: any[];
}

// Cases List Response (specific backend shape)
export interface CasesListResponse {
  per_page: number;
  page_number: number[];
  active_cases?: {
    cases_count?: number;
    active_cases?: Case[];
    cases?: Case[];
    offset: number | null;
  };
  closed_cases?: {
    cases_count?: number;
    close_cases?: Case[];
    closed_cases?: Case[];
    offset: number | null;
  };
  // Fallback for simple array response
  cases?: Case[];
  accounts?: Account[];
  contacts?: Contact[];
  status?: string[];
  priority?: string[];
  case_types?: string[];
  tags?: string[];
  teams?: Team[];
  users?: any[];
}

// Teams List Response (specific backend shape)
export interface TeamsListResponse {
  per_page: number;
  page_number: number[];
  active_teams?: {
    teams_count?: number;
    active_teams?: Team[];
    teams?: Team[];
    offset: number | null;
  };
  // Fallback for simple array response
  teams?: Team[];
  users?: any[];
}

// Documents List Response (specific backend shape)
export interface DocumentsListResponse {
  per_page: number;
  page_number: number[];
  active_documents?: {
    documents_count?: number;
    active_documents?: Document[];
    documents?: Document[];
    offset: number | null;
  };
  // Fallback for simple array response
  documents?: Document[];
  users?: any[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
