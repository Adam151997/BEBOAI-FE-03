# Frontend API Schema Alignment Guide

## Overview
This document describes how the frontend TypeScript types align with the FastAPI v2 backend schema requirements to prevent 422 validation errors.

## Type Structure

For each CRM module, we now have three distinct types:

1. **Model Type** (e.g., `Lead`, `Contact`, `Account`) - Represents the full object returned from the API
2. **Create Type** (e.g., `LeadCreate`, `ContactCreate`) - Defines required and optional fields for POST requests
3. **Update Type** (e.g., `LeadUpdate`, `ContactUpdate`) - All fields optional for PUT/PATCH requests

## Important Notes

### Field Name Differences (CREATE vs RESPONSE)

Some modules have different field names between CREATE payloads and API responses due to backend processing:

#### Invoices
- **CREATE Payload**: Uses `invoice_title`, `name`, `email`
- **RESPONSE**: Uses `invoice_number`, `account_name`, different structure
- This is by design - the backend transforms the create payload

#### Planner Events
- **CREATE Payload**: Uses `name` field
- **RESPONSE**: Uses `title` field
- The backend maps `name` → `title` internally

This is intentional backend behavior and our types correctly reflect these differences.

## Module-Specific Requirements

### 1. Leads

#### Required Fields (POST /api/v2/leads/)
```typescript
{
  title: string;      // Not empty - "Mr", "Ms", "Dr"
  email: string;      // Valid email format
  status: string;     // "open", "closed", "converted"
}
```

#### Optional Fields
- All other fields are optional with proper defaults
- Arrays default to `[]`: `assigned_to`, `tags`, `contacts`, `teams`
- Numbers are nullable: `probability`, `opportunity_amount`

#### Example Minimal Payload
```typescript
const leadData: LeadCreate = {
  title: "Mr",
  email: "john@example.com",
  status: "open"
};
```

### 2. Contacts

#### Required Fields (POST /api/v2/contacts/)
```typescript
{
  first_name: string;    // 1-255 chars
  last_name: string;     // 1-255 chars
  primary_email: string; // Valid email, unique
}
```

#### Example Minimal Payload
```typescript
const contactData: ContactCreate = {
  first_name: "John",
  last_name: "Doe",
  primary_email: "john.doe@example.com"
};
```

### 3. Accounts

#### Required Fields (POST /api/v2/accounts/)
```typescript
{
  name: string;         // 1-64 chars
  email: string;        // Valid email
  contact_name: string; // Not empty
}
```

#### Example Minimal Payload
```typescript
const accountData: AccountCreate = {
  name: "Acme Corp",
  email: "info@acme.com",
  contact_name: "John Smith"
};
```

### 4. Opportunities

#### Required Fields (POST /api/v2/opportunities/)
```typescript
{
  name: string;  // 1-64 chars
  stage: string; // "prospecting", "negotiation", "closed_won"
}
```

#### Example Minimal Payload
```typescript
const opportunityData: OpportunityCreate = {
  name: "Enterprise Deal",
  stage: "prospecting"
};
```

### 5. Tasks

#### Required Fields (POST /api/v2/tasks/)
```typescript
{
  title: string;    // 1-200 chars
  status: string;   // "open", "in_progress", "completed"
  priority: string; // "low", "medium", "high"
}
```

#### Example Minimal Payload
```typescript
const taskData: TaskCreate = {
  title: "Follow up with client",
  status: "open",
  priority: "high"
};
```

### 6. Teams

#### Required Fields (POST /api/v2/teams/)
```typescript
{
  name: string; // 1-100 chars
}
```

#### Example Minimal Payload
```typescript
const teamData: TeamCreate = {
  name: "Sales Team East"
};
```

### 7. Cases

#### Required Fields (POST /api/v2/cases/)
```typescript
{
  name: string;      // 1-64 chars
  status: string;    // "open", "in_progress", "closed"
  priority: string;  // "low", "medium", "high"
  closed_on: string; // Format: "YYYY-MM-DD"
}
```

#### Example Minimal Payload
```typescript
const caseData: CaseCreate = {
  name: "Support Ticket #123",
  status: "open",
  priority: "high",
  closed_on: "2025-12-31"
};
```

### 8. Events

#### Required Fields (POST /api/v2/events/)
```typescript
{
  name: string;       // 1-64 chars
  event_type: string; // "meeting", "call", "email"
  start_date: string; // Format: "YYYY-MM-DD"
  start_time: string; // Format: "HH:MM:SS"
  end_date: string;   // Format: "YYYY-MM-DD"
}
```

#### Example Minimal Payload
```typescript
const eventData: EventCreate = {
  name: "Client Meeting",
  event_type: "meeting",
  start_date: "2025-11-25",
  start_time: "14:00:00",
  end_date: "2025-11-25"
};
```

### 9. Invoices

#### Required Fields (POST /api/v2/invoices/)
```typescript
{
  invoice_title: string; // 1-50 chars
  name: string;          // 1-100 chars
  email: string;         // Valid email
}
```

#### Example Minimal Payload
```typescript
const invoiceData: InvoiceCreate = {
  invoice_title: "Invoice Q4",
  name: "Acme Corp",
  email: "billing@acme.com"
};
```

### 10. Planner

#### Required Fields (POST /api/v2/planner/)
```typescript
{
  name: string;       // 1-64 chars
  event_type: string; // 1-7 chars - "meeting", "call"
  start_date: string; // Format: "YYYY-MM-DD"
}
```

#### Example Minimal Payload
```typescript
const plannerData: PlannerEventCreate = {
  name: "Quarterly Review",
  event_type: "meeting",
  start_date: "2025-11-25"
};
```

## Common Validation Rules

### Email Validation
- Must be valid email format: `user@domain.com`
- Backend uses EmailStr from Pydantic

### Date Format
- Use ISO 8601 format: `"YYYY-MM-DD"`
- Example: `"2025-11-24"`

### Time Format
- Use 24-hour format: `"HH:MM:SS"`
- Example: `"14:30:00"`

### Array Fields
- Always send as arrays, even if empty: `[]`
- Never send `null` for array fields
- Always send arrays of integers for ID references: `[1, 2, 3]`

### Boolean Fields
- Send as JSON boolean: `true` or `false`
- Never send as strings `"true"` or `"false"`

### Decimal/Numeric Fields
- Can send as string or number
- Backend accepts: `100.50` or `"100.50"`
- Use 2 decimal places for currency

### String Length Constraints
Pay attention to maximum lengths:
- `name` fields: typically 64 chars
- `title` fields: typically 200 chars
- `invoice_title`: 50 chars
- `first_name`, `last_name`: 255 chars

## Using the Types in Forms

### Creating a New Record

```typescript
import { leadsService } from "@/services/leads.service";
import type { LeadCreate } from "@/types";

const handleCreateLead = async (formData: LeadCreate) => {
  try {
    const newLead = await leadsService.create(formData);
    console.log("Lead created:", newLead);
  } catch (error) {
    console.error("Error creating lead:", error);
  }
};
```

### Updating an Existing Record

```typescript
import { leadsService } from "@/services/leads.service";
import type { LeadUpdate } from "@/types";

const handleUpdateLead = async (leadId: string, updates: LeadUpdate) => {
  try {
    const updatedLead = await leadsService.update(leadId, updates);
    console.log("Lead updated:", updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
  }
};
```

### Partial Updates

```typescript
// Only send the fields you want to update
const updates: LeadUpdate = {
  status: "converted"
};

await leadsService.update(leadId, updates);
```

## Common 422 Error Patterns

### Missing Required Field
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
**Fix:** Ensure all REQUIRED fields are included in request body.

### Invalid Email Format
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```
**Fix:** Use valid email format: `user@domain.com`

### String Too Long
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "ensure this value has at most 64 characters",
      "type": "value_error.any_str.max_length"
    }
  ]
}
```
**Fix:** Respect max length constraints.

### Wrong Type
```json
{
  "detail": [
    {
      "loc": ["body", "assigned_to"],
      "msg": "value is not a valid list",
      "type": "type_error.list"
    }
  ]
}
```
**Fix:** Send arrays as `[]`, not `null` or string.

## Service Layer Architecture

All services extend the generic `CrudService` class:

```typescript
class CrudService<TModel, TCreate = Partial<TModel>, TUpdate = Partial<TModel>>
```

This provides type-safe CRUD operations:
- `getAll(params?)` - Returns `PaginatedResponse<TModel>`
- `getOne(id)` - Returns `TModel`
- `create(data)` - Accepts `TCreate | Partial<TModel>`, returns `TModel`
- `update(id, data)` - Accepts `TUpdate | Partial<TModel>`, returns `TModel`
- `partialUpdate(id, data)` - Accepts partial updates
- `delete(id)` - Returns `void`

### Backward Compatibility

The service methods accept both typed payloads (`TCreate`, `TUpdate`) and `Partial<TModel>` to maintain backward compatibility with existing form components. This design allows:

1. **New code** to use strongly-typed Create/Update interfaces with required field validation
2. **Existing forms** to continue working without modification
3. **Gradual migration** from old patterns to new typed patterns

When TypeScript can infer the type from usage (e.g., passing a `LeadCreate` literal), it enforces required fields. When passing `Partial<Lead>`, it remains flexible but loses compile-time validation.

**Recommendation**: Use the typed Create/Update interfaces in new code for maximum type safety.

Example service implementation:

```typescript
class LeadsService extends CrudService<Lead, LeadCreate, LeadUpdate> {
  constructor() {
    super("/leads/");
  }
}
```

## Testing Checklist

Before submitting data to the API:

- [ ] All REQUIRED fields are being sent
- [ ] Email fields use valid email format
- [ ] Dates use YYYY-MM-DD format
- [ ] Times use HH:MM:SS format
- [ ] Arrays are sent as [], not null
- [ ] Booleans are sent as JSON boolean, not string
- [ ] String fields respect max length constraints
- [ ] IDs reference existing records in database
- [ ] Test with minimal payload first, then add optional fields

## Migration from Old Code

If you have existing code using `Partial<Model>` types:

### Before:
```typescript
const data: Partial<Lead> = {
  title: "Mr",
  email: "test@example.com",
  // Missing status - will cause 422 error
};
await leadsService.create(data);
```

### After:
```typescript
const data: LeadCreate = {
  title: "Mr",
  email: "test@example.com",
  status: "open" // Now required by type
};
await leadsService.create(data);
```

The TypeScript compiler will now catch missing required fields at compile time!

## Additional Resources

- Backend API Specification: See problem statement for full details
- Type Definitions: `src/types/index.ts`, `src/types/invoices.ts`, `src/types/planner.ts`
- Service Implementations: `src/services/*.service.ts`
