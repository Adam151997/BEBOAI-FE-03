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

export interface ContactMin {
  id: string;
  first_name: string;
  last_name?: string;
  email?: string;
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
// Note: Forward references to types like Contact, Team, etc. are allowed in TypeScript
// as interfaces are hoisted during compilation. Full type definitions appear below.

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

// Lead Create Payload - Matches Backend POST /api/v2/leads/ REQUIRED fields
export interface LeadCreate {
  // REQUIRED fields
  title: string;  // Not empty - "Mr", "Ms", "Dr"
  email: string;  // Valid email format
  status: string;  // Must match LEAD_STATUS choices: "open", "closed", "converted"
  
  // OPTIONAL fields
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  source?: string | null;  // Must match LEAD_SOURCE if provided
  website?: string | null;
  description?: string | null;
  address_line?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;  // Must match COUNTRIES if provided
  industry?: string | null;  // Must match INDCHOICES if provided
  skype_ID?: string | null;
  probability?: number | null;  // 0-100
  opportunity_amount?: number | null;
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  tags?: number[];  // Array of Tag IDs (default: [])
  contacts?: number[];  // Array of Contact IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Lead Update Payload - Matches Backend PUT /api/v2/leads/{id}/ - ALL fields optional
export interface LeadUpdate {
  title?: string;
  email?: string;
  status?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  source?: string | null;
  website?: string | null;
  description?: string | null;
  address_line?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  industry?: string | null;
  skype_ID?: string | null;
  probability?: number | null;
  opportunity_amount?: number | null;
  assigned_to?: number[];
  tags?: number[];
  contacts?: number[];
  teams?: number[];
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

// Account Create Payload - Matches Backend POST /api/v2/accounts/ REQUIRED fields
export interface AccountCreate {
  // REQUIRED fields
  name: string;  // 1-64 chars
  email: string;  // Valid email
  contact_name: string;  // Not empty
  
  // OPTIONAL fields
  phone?: string | null;
  industry?: string | null;
  billing_address_line?: string | null;
  billing_street?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_postcode?: string | null;
  billing_country?: string | null;
  website?: string | null;
  description?: string | null;
  status?: string;  // Default: "open"
  lead?: number | null;  // Lead ID
  contacts?: number[];  // Array of Contact IDs (default: [])
  tags?: number[];  // Array of Tag IDs (default: [])
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Account Update Payload - Matches Backend PUT /api/v2/accounts/{id}/ - ALL fields optional
export interface AccountUpdate {
  name?: string;  // Must be 1-64 chars if provided
  email?: string;
  contact_name?: string;
  phone?: string | null;
  industry?: string | null;
  billing_address_line?: string | null;
  billing_street?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_postcode?: string | null;
  billing_country?: string | null;
  website?: string | null;
  description?: string | null;
  status?: string;
  lead?: number | null;
  contacts?: number[];
  tags?: number[];
  assigned_to?: number[];
  teams?: number[];
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

// Contact Create Payload - Matches Backend POST /api/v2/contacts/ REQUIRED fields
export interface ContactCreate {
  // REQUIRED fields
  first_name: string;  // 1-255 chars
  last_name: string;  // 1-255 chars
  primary_email: string;  // Valid email, unique
  
  // OPTIONAL fields
  salutation?: string;  // Default: "" - "Mr", "Ms", "Dr"
  date_of_birth?: string | null;  // Format: "YYYY-MM-DD"
  organization?: string | null;  // Company name
  title?: string;  // Default: "" - Job title
  secondary_email?: string;  // Default: ""
  mobile_number?: string | null;  // Phone format
  secondary_number?: string | null;
  department?: string | null;
  country?: string | null;  // Must match COUNTRIES
  language?: string | null;
  do_not_call?: boolean;  // Default: false
  description?: string | null;
  linked_in_url?: string | null;  // Valid URL
  facebook_url?: string | null;  // Valid URL
  twitter_username?: string | null;
  account?: number | null;  // Account ID
  address_id?: number | null;  // Address ID
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Contact Update Payload - Matches Backend PUT /api/v2/contacts/{id}/ - ALL fields optional
export interface ContactUpdate {
  first_name?: string;  // Must be 1-255 chars if provided
  last_name?: string;  // Must be 1-255 chars if provided
  primary_email?: string;
  salutation?: string;
  date_of_birth?: string | null;
  organization?: string | null;
  title?: string;
  secondary_email?: string;
  mobile_number?: string | null;
  secondary_number?: string | null;
  department?: string | null;
  country?: string | null;
  language?: string | null;
  do_not_call?: boolean;
  description?: string | null;
  linked_in_url?: string | null;
  facebook_url?: string | null;
  twitter_username?: string | null;
  account?: number | null;
  address_id?: number | null;
  assigned_to?: number[];
  teams?: number[];
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

// Opportunity Create Payload - Matches Backend POST /api/v2/opportunities/ REQUIRED fields
export interface OpportunityCreate {
  // REQUIRED fields
  name: string;  // 1-64 chars
  stage: string;  // Not empty - "prospecting", "negotiation", "closed_won"
  
  // OPTIONAL fields
  email?: string | null;  // Valid email if provided
  phone?: string | null;
  industry?: string | null;
  currency?: string | null;
  amount?: number | null;  // Decimal
  lead_source?: string | null;
  probability?: number;  // Default: 0 - Range: 0-100
  closed_on?: string | null;  // Format: "YYYY-MM-DD"
  description?: string | null;
  status?: string;  // Default: "open" - "open", "closed"
  account?: number | null;  // Account ID
  closed_by?: number | null;  // Profile ID
  contacts?: number[];  // Array of Contact IDs (default: [])
  tags?: number[];  // Array of Tag IDs (default: [])
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Opportunity Update Payload - Matches Backend PUT /api/v2/opportunities/{id}/ - ALL fields optional
export interface OpportunityUpdate {
  name?: string;  // Must be 1-64 chars if provided
  stage?: string;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  currency?: string | null;
  amount?: number | null;
  lead_source?: string | null;
  probability?: number;
  closed_on?: string | null;
  description?: string | null;
  status?: string;
  account?: number | null;
  closed_by?: number | null;
  contacts?: number[];
  tags?: number[];
  assigned_to?: number[];
  teams?: number[];
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

// Task Create Payload - Matches Backend POST /api/v2/tasks/ REQUIRED fields
export interface TaskCreate {
  // REQUIRED fields
  title: string;  // 1-200 chars
  status: string;  // Not empty - "open", "in_progress", "completed"
  priority: string;  // Not empty - "low", "medium", "high"
  
  // OPTIONAL fields
  task_type?: string | null;
  due_date?: string | null;  // Format: "YYYY-MM-DD"
  description?: string | null;
  account?: number | null;  // Account ID
  contacts?: number[];  // Array of Contact IDs (default: [])
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Task Update Payload - Matches Backend PUT /api/v2/tasks/{id}/ - ALL fields optional
export interface TaskUpdate {
  title?: string;  // Must be 1-200 chars if provided
  status?: string;
  priority?: string;
  task_type?: string | null;
  due_date?: string | null;
  description?: string | null;
  account?: number | null;
  contacts?: number[];
  assigned_to?: number[];
  teams?: number[];
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

// Event Create Payload - Matches Backend POST /api/v2/events/ REQUIRED fields
export interface EventCreate {
  // REQUIRED fields
  name: string;  // 1-64 chars
  event_type: string;  // Not empty - "meeting", "call", "email"
  start_date: string;  // Required - Format: "YYYY-MM-DD"
  start_time: string;  // Required - Format: "HH:MM:SS"
  end_date: string;  // Required - Format: "YYYY-MM-DD"
  
  // OPTIONAL fields
  status?: string | null;
  end_time?: string | null;  // Format: "HH:MM:SS"
  description?: string | null;
  date_of_meeting?: string | null;
  account?: number | null;  // Account ID
  contacts?: number[];  // Array of Contact IDs (default: [])
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Event Update Payload - Matches Backend PUT /api/v2/events/{id}/ - ALL fields optional
export interface EventUpdate {
  name?: string;  // Must be 1-64 chars if provided
  event_type?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  status?: string | null;
  end_time?: string | null;
  description?: string | null;
  date_of_meeting?: string | null;
  account?: number | null;
  contacts?: number[];
  assigned_to?: number[];
  teams?: number[];
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

// Case Create Payload - Matches Backend POST /api/v2/cases/ REQUIRED fields
export interface CaseCreate {
  // REQUIRED fields
  name: string;  // 1-64 chars
  status: string;  // Not empty - "open", "in_progress", "closed"
  priority: string;  // Not empty - "low", "medium", "high"
  closed_on: string;  // Required - Format: "YYYY-MM-DD"
  
  // OPTIONAL fields
  case_type?: string;  // Default: ""
  description?: string | null;
  account?: number | null;  // Account ID
  contacts?: number[];  // Array of Contact IDs (default: [])
  assigned_to?: number[];  // Array of Profile IDs (default: [])
  teams?: number[];  // Array of Team IDs (default: [])
}

// Case Update Payload - Matches Backend PUT /api/v2/cases/{id}/ - ALL fields optional
export interface CaseUpdate {
  name?: string;  // Must be 1-64 chars if provided
  status?: string;
  priority?: string;
  closed_on?: string;
  case_type?: string;
  description?: string | null;
  account?: number | null;
  contacts?: number[];
  assigned_to?: number[];
  teams?: number[];
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

// Team Create Payload - Matches Backend POST /api/v2/teams/ REQUIRED fields
export interface TeamCreate {
  // REQUIRED fields
  name: string;  // 1-100 chars
  
  // OPTIONAL fields
  description?: string;  // Default: ""
  assign_users?: number[];  // Array of Profile IDs (default: [])
}

// Team Update Payload - Matches Backend PUT /api/v2/teams/{id}/ - ALL fields optional
export interface TeamUpdate {
  name?: string;  // Must be 1-100 chars if provided
  description?: string;
  assign_users?: number[];
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
