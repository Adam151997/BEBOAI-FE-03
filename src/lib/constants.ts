/**
 * Backend API Constants
 * These values must exactly match the backend API schema and validations
 * as defined in BEBOAI-03 repository swagger_params and models
 */

// Lead Status Choices - from leads/swagger_params1.py
export const LEAD_STATUS_CHOICES = [
  { value: "assigned", label: "Assigned" },
  { value: "in process", label: "In Process" },
  { value: "converted", label: "Converted" },
  { value: "recycled", label: "Recycled" },
  { value: "closed", label: "Closed" },
] as const;

// Lead Source Choices - common across CRM modules
export const LEAD_SOURCE_CHOICES = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "existing customer", label: "Existing Customer" },
  { value: "partner", label: "Partner" },
  { value: "public relations", label: "Public Relations" },
  { value: "campaign", label: "Campaign" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
] as const;

// Opportunity Stage Choices
export const OPPORTUNITY_STAGE_CHOICES = [
  { value: "QUALIFICATION", label: "Qualification" },
  { value: "NEEDS ANALYSIS", label: "Needs Analysis" },
  { value: "VALUE PROPOSITION", label: "Value Proposition" },
  { value: "ID. DECISION MAKERS", label: "ID. Decision Makers" },
  { value: "PERCEPTION ANALYSIS", label: "Perception Analysis" },
  { value: "PROPOSAL/PRICE QUOTE", label: "Proposal/Price Quote" },
  { value: "NEGOTIATION/REVIEW", label: "Negotiation/Review" },
  { value: "CLOSED WON", label: "Closed Won" },
  { value: "CLOSED LOST", label: "Closed Lost" },
] as const;

// Opportunity Lead Source (same as Lead Source but with None option)
export const OPPORTUNITY_LEAD_SOURCE_CHOICES = [
  { value: "None", label: "None" },
  { value: "Call", label: "Call" },
  { value: "Email", label: "Email" },
  { value: "Existing Customer", label: "Existing Customer" },
  { value: "Partner", label: "Partner" },
  { value: "Public Relations", label: "Public Relations" },
  { value: "Campaign", label: "Campaign" },
  { value: "Website", label: "Website" },
  { value: "Other", label: "Other" },
] as const;

// Task Status Choices
export const TASK_STATUS_CHOICES = [
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
] as const;

// Task Priority Choices
export const TASK_PRIORITY_CHOICES = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
] as const;

// Case Status Choices
export const CASE_STATUS_CHOICES = [
  { value: "New", label: "New" },
  { value: "Working", label: "Working" },
  { value: "Closed", label: "Closed" },
  { value: "Rejected", label: "Rejected" },
  { value: "Duplicate", label: "Duplicate" },
] as const;

// Case Priority Choices (same as Task Priority)
export const CASE_PRIORITY_CHOICES = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
] as const;

// Case Type Choices
export const CASE_TYPE_CHOICES = [
  { value: "Problem", label: "Problem" },
  { value: "Feature Request", label: "Feature Request" },
  { value: "Data Corrupted", label: "Data Corrupted" },
  { value: "Functionality Request", label: "Functionality Request" },
  { value: "Integration", label: "Integration" },
  { value: "Others", label: "Others" },
] as const;

// Account Status Choices
export const ACCOUNT_STATUS_CHOICES = [
  { value: "open", label: "Open" },
  { value: "close", label: "Close" },
] as const;

// Account Industry Choices - from accounts/swagger_params.py
export const ACCOUNT_INDUSTRY_CHOICES = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "APPAREL & ACCESSORIES", label: "Apparel & Accessories" },
  { value: "AUTOMOTIVE", label: "Automotive" },
  { value: "BANKING", label: "Banking" },
  { value: "BIOTECHNOLOGY", label: "Biotechnology" },
  { value: "BUILDING MATERIALS & EQUIPMENT", label: "Building Materials & Equipment" },
  { value: "CHEMICAL", label: "Chemical" },
  { value: "COMPUTER", label: "Computer" },
  { value: "EDUCATION", label: "Education" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "ENERGY", label: "Energy" },
  { value: "ENTERTAINMENT & LEISURE", label: "Entertainment & Leisure" },
  { value: "FINANCE", label: "Finance" },
  { value: "FOOD & BEVERAGE", label: "Food & Beverage" },
  { value: "GROCERY", label: "Grocery" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "LEGAL", label: "Legal" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "PUBLISHING", label: "Publishing" },
  { value: "REAL ESTATE", label: "Real Estate" },
  { value: "RETAIL", label: "Retail" },
  { value: "SHIPPING", label: "Shipping" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "TELECOMMUNICATIONS", label: "Telecommunications" },
  { value: "TELEVISION", label: "Television" },
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "VENTURE CAPITAL", label: "Venture Capital" },
  { value: "OTHER", label: "Other" },
] as const;

// Currency Choices
export const CURRENCY_CHOICES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
  { value: "AUD", label: "AUD" },
  { value: "CAD", label: "CAD" },
  { value: "JPY", label: "JPY" },
] as const;

// Event Type Choices
export const EVENT_TYPE_CHOICES = [
  { value: "Call", label: "Call" },
  { value: "Meeting", label: "Meeting" },
  { value: "Task", label: "Task" },
  { value: "Email", label: "Email" },
] as const;

// Event Status Choices
export const EVENT_STATUS_CHOICES = [
  { value: "Planned", label: "Planned" },
  { value: "Held", label: "Held" },
  { value: "Not Held", label: "Not Held" },
  { value: "Not Started", label: "Not Started" },
  { value: "Started", label: "Started" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Deferred", label: "Deferred" },
] as const;
