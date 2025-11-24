# Schema Alignment - Implementation Examples

This document provides practical examples of using the new typed interfaces.

## Example 1: Creating a Lead with Type Safety

### ❌ Old Way (No Type Safety)
```typescript
// No compile-time validation - missing 'status' causes 422 at runtime
const leadData = {
  title: "Mr",
  email: "john@example.com"
  // Missing required 'status' field!
};

await leadsService.create(leadData);
// Runtime error: 422 - "field required: status"
```

### ✅ New Way (Type Safe)
```typescript
import type { LeadCreate } from "@/types";

// TypeScript enforces all required fields at compile time
const leadData: LeadCreate = {
  title: "Mr",
  email: "john@example.com",
  status: "open" // ✅ Compiler ensures this is present
};

await leadsService.create(leadData);
// Success! All required fields present
```

## Example 2: Creating a Contact

```typescript
import { contactsService } from "@/services/contacts.service";
import type { ContactCreate } from "@/types";

const newContact: ContactCreate = {
  // Required fields
  first_name: "John",
  last_name: "Doe", 
  primary_email: "john.doe@example.com",
  
  // Optional fields
  salutation: "Mr",
  mobile_number: "+1-555-0123",
  organization: "Acme Corp",
  assigned_to: [1, 2], // Array of Profile IDs
  teams: [5] // Array of Team IDs
};

try {
  const contact = await contactsService.create(newContact);
  console.log("Contact created:", contact.id);
} catch (error) {
  console.error("Failed to create contact:", error);
}
```

## Example 3: Creating an Account

```typescript
import { accountsService } from "@/services/accounts.service";
import type { AccountCreate } from "@/types";

const newAccount: AccountCreate = {
  // All 3 required fields
  name: "Acme Corporation",
  email: "info@acme.com",
  contact_name: "John Smith",
  
  // Optional fields
  phone: "+1-555-0100",
  industry: "Technology",
  website: "https://acme.com",
  billing_city: "San Francisco",
  billing_country: "USA",
  assigned_to: [1, 3],
  tags: [10, 15]
};

const account = await accountsService.create(newAccount);
```

## Example 4: Creating a Task

```typescript
import { tasksService } from "@/services/tasks.service";
import type { TaskCreate } from "@/types";

const newTask: TaskCreate = {
  // Required fields
  title: "Follow up with client",
  status: "open",
  priority: "high",
  
  // Optional fields
  due_date: "2025-12-15", // YYYY-MM-DD format
  description: "Discuss renewal options",
  account: 42, // Account ID as number
  contacts: [10, 20], // Contact IDs
  assigned_to: [1]
};

const task = await tasksService.create(newTask);
```

## Example 5: Creating an Event

```typescript
import { eventsService } from "@/services/events.service";
import type { EventCreate } from "@/types";

const newEvent: EventCreate = {
  // Required fields
  name: "Client Meeting",
  event_type: "meeting",
  start_date: "2025-11-25", // YYYY-MM-DD
  start_time: "14:00:00",   // HH:MM:SS
  end_date: "2025-11-25",
  
  // Optional fields
  end_time: "15:30:00",
  status: "Planned",
  description: "Quarterly business review",
  account: 42,
  contacts: [10],
  assigned_to: [1, 2]
};

const event = await eventsService.create(newEvent);
```

## Example 6: Updating a Lead (Partial Update)

```typescript
import { leadsService } from "@/services/leads.service";
import type { LeadUpdate } from "@/types";

// All fields optional in updates
const updates: LeadUpdate = {
  status: "converted", // Only updating status
  probability: 90
};

const updatedLead = await leadsService.update(leadId, updates);
```

## Example 7: Form Submission with Validation

```typescript
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { accountsService } from "@/services/accounts.service";
import type { AccountCreate } from "@/types";

function AccountForm() {
  const [formData, setFormData] = useState<AccountCreate>({
    name: "",
    email: "",
    contact_name: ""
  });
  
  const createMutation = useMutation({
    mutationFn: (data: AccountCreate) => accountsService.create(data),
    onSuccess: (account) => {
      console.log("Account created:", account.id);
    },
    onError: (error: any) => {
      // Handle 422 validation errors
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data);
      }
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TypeScript ensures all required fields are present
    createMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Company Name"
      />
      <input
        required
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <input
        required
        value={formData.contact_name}
        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
        placeholder="Contact Name"
      />
      <button type="submit">Create Account</button>
    </form>
  );
}
```

## Example 8: Creating an Invoice

```typescript
import { invoicesService } from "@/services/invoices.service";
import type { InvoiceCreate } from "@/types/invoices";

const newInvoice: InvoiceCreate = {
  // Required fields
  invoice_title: "Q4 Services",
  name: "Acme Corporation",
  email: "billing@acme.com",
  
  // Optional fields
  status: "Draft",
  due_date: "2025-12-31",
  currency: "USD",
  quantity: 10,
  rate: 150.00,
  tax: 12.5,
  total_amount: 1687.50,
  accounts: [42],
  assigned_to: [1]
};

const invoice = await invoicesService.create(newInvoice);
```

## Example 9: Creating a Planner Event

```typescript
import { plannerService } from "@/services/planner.service";
import type { PlannerEventCreate } from "@/types/planner";

const plannerEvent: PlannerEventCreate = {
  // Required fields
  name: "Quarterly Planning Session",
  event_type: "meeting",
  start_date: "2025-12-01",
  
  // Optional fields
  status: "Planned",
  priority: "High",
  duration: 120, // minutes
  description: "Strategic planning for Q1 2026",
  parent_type: "account",
  parent_id: 42,
  attendees_user: [1, 2, 3],
  attendees_contacts: [10, 20],
  assigned_to: [1]
};

const event = await plannerService.create(plannerEvent);
```

## Example 10: Handling Array Fields Correctly

```typescript
import type { LeadCreate } from "@/types";

// ✅ Correct: Arrays of IDs as numbers
const correctLead: LeadCreate = {
  title: "Mr",
  email: "test@example.com",
  status: "open",
  assigned_to: [1, 2, 3],    // ✅ number[]
  teams: [5, 6],             // ✅ number[]
  contacts: [10, 20],        // ✅ number[]
  tags: []                   // ✅ Empty array is fine
};

// ❌ Wrong: String IDs cause type errors
const wrongLead: LeadCreate = {
  title: "Mr",
  email: "test@example.com",
  status: "open",
  assigned_to: ["1", "2"],   // ❌ string[] - Type error!
  teams: null,               // ❌ null - Use [] instead
  contacts: undefined        // ❌ undefined - Use [] instead
};
```

## Example 11: Working with Dates and Times

```typescript
import type { EventCreate, CaseCreate } from "@/types";

// ✅ Correct date/time formats
const event: EventCreate = {
  name: "Meeting",
  event_type: "meeting",
  start_date: "2025-11-25",    // ✅ YYYY-MM-DD
  start_time: "14:00:00",      // ✅ HH:MM:SS (24-hour)
  end_date: "2025-11-25"
};

const case_: CaseCreate = {
  name: "Support Ticket",
  status: "open",
  priority: "high",
  closed_on: "2025-12-31"      // ✅ YYYY-MM-DD
};

// ❌ Wrong formats
const wrongEvent: EventCreate = {
  name: "Meeting",
  event_type: "meeting",
  start_date: "11/25/2025",    // ❌ Wrong format - use YYYY-MM-DD
  start_time: "2:00 PM",       // ❌ Wrong format - use 14:00:00
  end_date: "2025-11-25"
};
```

## Example 12: Gradual Migration Strategy

```typescript
// Old form code (still works with Partial<Model>)
const handleOldSubmit = (formData: any) => {
  // This still works but has less type safety
  await leadsService.create(formData as Partial<Lead>);
};

// New form code (better type safety)
const handleNewSubmit = (formData: LeadCreate) => {
  // TypeScript validates all required fields at compile time
  await leadsService.create(formData);
};

// You can migrate forms gradually without breaking existing code
```

## Common Pitfalls and Solutions

### Pitfall 1: Forgetting Required Fields
```typescript
// ❌ Will fail at compile time
const badAccount: AccountCreate = {
  name: "Acme",
  email: "info@acme.com"
  // Missing contact_name!
};

// ✅ All required fields present
const goodAccount: AccountCreate = {
  name: "Acme",
  email: "info@acme.com",
  contact_name: "John Smith"
};
```

### Pitfall 2: Using String IDs Instead of Numbers
```typescript
// ❌ Wrong type
assigned_to: ["1", "2", "3"]  // string[]

// ✅ Correct type
assigned_to: [1, 2, 3]        // number[]
```

### Pitfall 3: Using null Instead of Empty Arrays
```typescript
// ❌ Don't use null for arrays
contacts: null

// ✅ Use empty array
contacts: []
```

### Pitfall 4: Wrong Date Format
```typescript
// ❌ Wrong formats
due_date: "12/31/2025"        // MM/DD/YYYY
due_date: "31-12-2025"        // DD-MM-YYYY

// ✅ Correct format
due_date: "2025-12-31"        // YYYY-MM-DD
```

## Best Practices

1. **Always use typed interfaces** for new code:
   ```typescript
   import type { LeadCreate } from "@/types";
   const data: LeadCreate = { ... };
   ```

2. **Let TypeScript infer types** when possible:
   ```typescript
   // Type is inferred from the interface
   const lead: LeadCreate = {
     title: "Mr",
     email: "test@example.com",
     status: "open"
   };
   ```

3. **Use empty arrays** for optional array fields:
   ```typescript
   assigned_to: [], // Not null or undefined
   ```

4. **Validate dates** before submission:
   ```typescript
   const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
   ```

5. **Handle API errors** appropriately:
   ```typescript
   try {
     await service.create(data);
   } catch (error: any) {
     if (error.response?.status === 422) {
       // Handle validation errors
       console.error("Validation failed:", error.response.data);
     }
   }
   ```

## Summary

The new typed interfaces provide:
- ✅ Compile-time validation of required fields
- ✅ Better IntelliSense/autocomplete in IDEs
- ✅ Self-documenting code
- ✅ Reduced runtime errors
- ✅ Easier maintenance and refactoring

Use them in all new code for a better development experience!
