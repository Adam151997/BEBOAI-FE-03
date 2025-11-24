// ========================================
// Planner Types - Match FastAPI v2 Pydantic Schemas
// Matches apiv2/schemas/planner.py
// ========================================

import type { UserMin, TeamMin, AccountMin, ContactMin, AttachmentResponse } from "./index";

// Event/Planner event status
export type PlannerEventStatus = 
  | "Planned" 
  | "In Progress" 
  | "Completed" 
  | "Cancelled" 
  | "Postponed";

// Event priority
export type PlannerEventPriority = "Low" | "Medium" | "High" | "Urgent";

// Event type
export type PlannerEventType = 
  | "Meeting" 
  | "Call" 
  | "Task" 
  | "Deadline" 
  | "Reminder" 
  | "Other";

// Recurrence pattern
export type RecurrencePattern = "Daily" | "Weekly" | "Monthly" | "Yearly" | "Custom";

// Reminder response
// Matches apiv2/schemas/planner.py::ReminderResponse
export interface ReminderResponse {
  id: string;
  remind_at: string;
  message?: string;
  is_sent?: boolean;
  sent_at?: string;
  created_at?: string;
}

// Reminder create payload
// Matches apiv2/schemas/planner.py::ReminderCreate
export interface ReminderCreate {
  remind_at: string;
  message?: string;
}

// Planner event response
// Matches apiv2/schemas/planner.py::PlannerEventResponse
export interface PlannerEventResponse {
  id: string;
  title: string;
  description?: string;
  
  // Event type and status
  event_type: PlannerEventType;
  status: PlannerEventStatus;
  priority?: PlannerEventPriority;
  
  // Date and time
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  all_day?: boolean;
  
  // Location
  location?: string;
  
  // Recurrence
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
  recurring_days?: string[];
  
  // Related entities
  account?: AccountMin;
  contacts?: ContactMin[];
  
  // Assignment
  created_by?: UserMin;
  assigned_to?: UserMin[];
  teams?: TeamMin[];
  
  // Reminders
  reminders?: ReminderResponse[];
  
  // Tags and notes
  tags?: string[];
  notes?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Related data counts
  comments_count?: number;
  attachments_count?: number;
}

// Planner event create payload - Matches Backend POST /api/v2/planner/ REQUIRED fields
export interface PlannerEventCreate {
  // REQUIRED fields
  name: string;  // 1-64 chars
  event_type: string;  // 1-7 chars - "meeting", "call"
  start_date: string;  // Required - Format: "YYYY-MM-DD"
  
  // OPTIONAL fields
  status?: string | null;
  direction?: string | null;
  close_date?: string | null;
  duration?: number | null;  // Minutes
  priority?: string | null;
  description?: string | null;
  is_active?: boolean;  // Default: false
  parent_type?: string | null;  // "account", "lead", "opportunity", "case"
  parent_id?: number | null;  // ID of parent object
  reminders?: number[];  // Array of Reminder IDs (default: [])
  attendees_user?: number[];  // Array of User IDs (default: [])
  attendees_contacts?: number[];  // Array of Contact IDs (default: [])
  attendees_leads?: number[];  // Array of Lead IDs (default: [])
  assigned_to?: number[];  // Array of User IDs (default: [])
}

// Planner event update payload - Matches Backend PUT /api/v2/planner/{id}/ - ALL fields optional
export interface PlannerEventUpdate {
  name?: string;  // Must be 1-64 chars if provided
  event_type?: string;  // Must be 1-7 chars if provided
  start_date?: string;
  status?: string | null;
  direction?: string | null;
  close_date?: string | null;
  duration?: number | null;
  priority?: string | null;
  description?: string | null;
  is_active?: boolean;
  parent_type?: string | null;
  parent_id?: number | null;
  reminders?: number[];
  attendees_user?: number[];
  attendees_contacts?: number[];
  attendees_leads?: number[];
  assigned_to?: number[];
}

// Planner event list response
// Matches apiv2/schemas/planner.py::PlannerEventListResponse
export interface PlannerEventListResponse {
  events: PlannerEventResponse[];
  events_count: number;
  per_page: number;
  page_number: number;
  offset?: number | null;
}

// Comment create for planner
export interface PlannerCommentCreate {
  comment: string;
}

// Attachment response for planner
export interface PlannerAttachmentResponse extends AttachmentResponse {
  event_id?: string;
}

// History response for planner
export interface PlannerHistoryResponse {
  id: string;
  action: string;
  description?: string;
  performed_by?: UserMin;
  created_at?: string;
  changes?: Record<string, any>;
}
