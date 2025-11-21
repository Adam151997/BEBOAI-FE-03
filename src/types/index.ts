// User and Auth Types
export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
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
  api_key: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_details: User;
  org: Organization;
}

// Lead Types
export interface Lead {
  id: string;
  title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status?: string;
  source?: string;
  company?: string;
  website?: string;
  address_line?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  description?: string;
  assigned_to?: User[];
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
  billing_address_line?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  description?: string;
  contacts?: string[];
  assigned_to?: User[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Contact Types
export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address_line?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  account?: string;
  description?: string;
  assigned_to?: User[];
  created_at?: string;
  updated_at?: string;
}

// Opportunity Types
export interface Opportunity {
  id: string;
  name: string;
  account?: string;
  stage: "prospecting" | "qualification" | "needs-analysis" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  amount?: number;
  probability?: number;
  close_date?: string;
  lead_source?: string;
  description?: string;
  assigned_to?: User[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  status: "new" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string;
  description?: string;
  account?: string;
  contact?: string;
  assigned_to?: User[];
  created_at?: string;
  updated_at?: string;
}

// Event Types
export interface Event {
  id: string;
  name: string;
  event_type: "meeting" | "call" | "task" | "deadline";
  status: "planned" | "held" | "not_held" | "not_started";
  start_date: string;
  end_date?: string;
  description?: string;
  is_recurring?: boolean;
  contacts?: string[];
  assigned_to?: User[];
  created_at?: string;
  updated_at?: string;
}

// Case Types
export interface Case {
  id: string;
  name: string;
  status?: string;
  priority?: "low" | "medium" | "high";
  case_type?: "problem" | "feature_request" | "question" | "bug";
  description?: string;
  account?: string;
  contacts?: string[];
  assigned_to?: User[];
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

// Comment Types
export interface Comment {
  id: string;
  comment: string;
  commented_by?: User;
  created_at?: string;
}

// Attachment Types
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

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
