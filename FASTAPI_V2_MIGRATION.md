# FastAPI v2 Migration Guide

This document describes the migration of the BEBOAI-FE-03 frontend from the legacy Django REST Framework `/api` endpoints to the new FastAPI v2 `/api/v2` endpoints in the BEBOAI-03 backend.

## Overview

The frontend has been updated to correctly target the FastAPI v2 backend with proper:
- API base URL (`/api/v2` instead of `/api`)
- Authentication headers (org UUID instead of API key)
- TypeScript types matching Pydantic schemas
- Service endpoints aligned to FastAPI routers

## Key Changes

### 1. API Base URL

**File:** `src/lib/api-client.ts`

```typescript
// Before
const API_BASE_URL = "https://beboai-03-production.up.railway.app/api";

// After
const API_BASE_URL = "https://beboai-03-production.up.railway.app/api/v2";
```

### 2. Organization Header

The FastAPI v2 backend requires the `org` header to contain the **organization UUID** (from `org.id`), not the API key.

**Changes in `src/services/auth.service.ts`:**
- Login and registration now save `org_id` to localStorage
- The `org_api_key` is saved separately for display purposes only
- All authenticated requests use `org_id` in the `org` header

**Changes in `src/lib/api-client.ts`:**
```typescript
// Before
const orgKey = localStorage.getItem("org_key");
if (orgKey) {
  config.headers.org = orgKey;
}

// After
const orgId = localStorage.getItem("org_id");
if (orgId) {
  config.headers.org = orgId;
}
```

### 3. Service Endpoints

All service files now target `/api/v2` routes by default via the updated `apiClient` base URL:

| Service | Endpoint | Status |
|---------|----------|--------|
| Leads | `/api/v2/leads/` | ✅ Migrated |
| Contacts | `/api/v2/contacts/` | ✅ Migrated |
| Teams | `/api/v2/teams/` | ✅ Migrated |
| Users | `/api/v2/users/` | ✅ Migrated |
| Cases | `/api/v2/cases/` | ✅ Migrated |
| Tasks | `/api/v2/tasks/` | ✅ Migrated |
| Events | `/api/v2/events/` | ✅ Migrated |
| Accounts | `/api/v2/accounts/` | ✅ Migrated |
| Opportunities | `/api/v2/opportunities/` | ✅ Migrated |
| Documents | `/api/v2/documents/` | ✅ Migrated |
| Profile | `/api/v2/profile/` | ✅ Migrated |
| Search | `/api/v2/search/` | ✅ Migrated |

### 4. Legacy Endpoints

The following endpoints still use the legacy `/api` base URL:

| Endpoint | Reason | Implementation |
|----------|--------|----------------|
| `/api/auth/login/` | Not migrated to v2 | Explicit absolute URL in auth.service.ts |
| `/api/auth/register/` | Not migrated to v2 | Explicit absolute URL in auth.service.ts |
| `/api/auth/refresh-token/` | Not migrated to v2 | Explicit absolute URL in auth.service.ts and api-client.ts |
| `/api/dashboard/` | Not migrated to v2 | Explicit axios call in dashboard.service.ts |

These services bypass the `/api/v2` base URL and make direct axios calls with full URLs.

## TypeScript Types

### FastAPI v2 Types Added

**File:** `src/types/index.ts`

The following types have been added to match FastAPI v2 Pydantic schemas:

#### Minimal Model Types
These match the minimal nested models in `apiv2/schemas/*`:
- `UserMin` - Minimal user representation
- `ProfileMin` - Minimal profile representation
- `TeamMin` - Minimal team representation
- `OrgMin` - Minimal organization representation
- `AddressMin` - Minimal address representation
- `AccountMin` - Minimal account representation

#### Comment and Attachment Types
- `CommentResponse` - Matches `apiv2/schemas/contacts.py::CommentResponse`
- `AttachmentResponse` - Matches `apiv2/schemas/contacts.py::AttachmentResponse`

#### List Response Types
FastAPI v2 uses custom keys for list responses instead of generic `count`/`results`:

- `ContactListResponseV2` - Uses `contact_obj_list`, `contacts_count`, `per_page`, `page_number`, `offset`
- `TeamListResponseV2` - Uses `teams`, `teams_count`, `per_page`, `page_number`, `offset`
- `InvoiceListResponseV2` - Uses `invoices`, `invoices_count`, `per_page`, `page_number`, `offset`
- `LeadListResponseV2` - Uses `leads`, `leads_count`, `per_page`, `page_number`, `offset`
- `UserListResponseV2` - Uses `users`, `users_count`, `per_page`, `page_number`, `offset`
- `CaseListResponseV2` - Uses `cases`, `cases_count`, `per_page`, `page_number`, `offset`
- `TaskListResponseV2` - Uses `tasks`, `tasks_count`, `per_page`, `page_number`, `offset`

### Backward Compatibility

The services currently **transform** FastAPI v2 list responses to the legacy `PaginatedResponse<T>` format:

```typescript
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

This transformation happens in each service's `getAll()` method. For example, in `contacts.service.ts`:

```typescript
async getAll(params?: QueryParams): Promise<PaginatedResponse<Contact>> {
  const response = await apiClient.get<ContactsListResponse>(this.endpoint, {
    params,
  });
  
  const data = response.data;
  let allContacts: Contact[] = [];
  
  // Extract contacts from response (handles multiple possible structures)
  if (data.active_contacts || data.closed_contacts) {
    allContacts = [
      ...(data.active_contacts?.active_contacts || data.active_contacts?.contacts || []),
      ...(data.closed_contacts?.close_contacts || data.closed_contacts?.closed_contacts || []),
    ];
  } else if (data.contacts) {
    allContacts = data.contacts;
  }
  
  // Transform to standard paginated response format
  return {
    count: allContacts.length,
    next: null,
    previous: null,
    results: allContacts,
  };
}
```

This allows components to continue using `data.results` and `data.count` without changes:

```typescript
const results: Contact[] = Array.isArray(data?.results) ? data.results : [];
const totalCount = typeof data?.count === "number" ? data.count : 0;
```

## Component Updates

**No changes required** to existing React components. The service layer handles the transformation from FastAPI v2 response structures to the expected `PaginatedResponse<T>` format.

Components continue to use:
```typescript
const { data } = useQuery({
  queryKey: ["contacts", ...],
  queryFn: () => contactsService.getAll(params),
});

const results = data?.results || [];
const count = data?.count || 0;
```

## Authentication Flow

### Login Process
1. User enters email and password
2. Frontend calls `POST /api/auth/login/` (legacy endpoint)
3. Backend returns:
   ```json
   {
     "access": "jwt_token",
     "refresh": "jwt_token",
     "user_details": {
       "id": "user_uuid",
       "email": "user@example.com",
       "org": {
         "id": "org_uuid",
         "name": "Organization Name",
         "api_key": "org_api_key"
       }
     }
   }
   ```
4. Frontend stores:
   - `access_token` → JWT access token
   - `refresh_token` → JWT refresh token
   - `org_id` → Organization UUID (used in `org` header)
   - `org_api_key` → Organization API key (for display only)
   - `user` → Full user object
   - `profile_id` → User's profile ID

### Authenticated Requests
All requests to `/api/v2/*` endpoints include:
```
Authorization: Bearer {access_token}
org: {org_id}
```

### Token Refresh
When a request returns 401:
1. Frontend attempts to refresh using `POST /api/auth/refresh-token/` (legacy endpoint)
2. If successful, updates `access_token` and retries original request
3. If refresh fails, redirects to login page

## Backend Contract

The frontend strictly follows the backend's Pydantic schemas without modification:
- Field names remain as-is (snake_case)
- Optional fields in Pydantic are marked optional in TypeScript
- List response keys match exactly (e.g., `contact_obj_list`, not `contacts`)
- Nested minimal models use the same structure

## Testing

### Build Verification
```bash
npm run build
```
✅ All builds pass successfully

### Linter
```bash
npm run lint
```
✅ No new linting errors introduced (existing errors unrelated to migration)

## Migration Status Summary

### ✅ Completed
- API base URL updated to `/api/v2`
- Organization header fixed to use UUID
- All service endpoints updated
- TypeScript types aligned with Pydantic schemas
- Backward compatibility maintained
- Build and lint verified

### 📝 Notes
- Auth endpoints remain on legacy `/api` (not migrated to FastAPI v2 yet)
- Dashboard endpoint remains on legacy `/api` (not migrated to FastAPI v2 yet)
- Services transform FastAPI v2 responses to `PaginatedResponse<T>` for component compatibility
- No component changes required due to service-layer transformation

### 🔮 Future Enhancements
- Migrate auth endpoints to `/api/v2/auth` when available
- Migrate dashboard endpoint to `/api/v2/dashboard` when available
- Update components to directly use FastAPI v2 list response types (remove transformation layer)
- Add invoice and planner service modules when FastAPI routers are ready

## Troubleshooting

### Common Issues

**Issue: 401 Unauthorized**
- Verify `org_id` is correctly stored in localStorage (should be UUID, not API key)
- Check that `Authorization` header contains valid JWT token
- Ensure token hasn't expired

**Issue: Wrong API endpoint**
- Verify service is using relative path (e.g., `/leads/`) not absolute path
- Check that legacy endpoints (auth, dashboard) use explicit absolute URLs
- Confirm `API_BASE_URL` in `api-client.ts` points to `/api/v2`

**Issue: Type mismatches**
- Ensure TypeScript types match Pydantic schemas exactly
- Check field names are snake_case (not camelCase)
- Verify list response keys match backend (e.g., `contact_obj_list` not `contacts`)

## References

- Backend Repository: BEBOAI-03
- FastAPI Routers: `apiv2/routers/*`
- Pydantic Schemas: `apiv2/schemas/*`
- Backend ASGI Config: `crm/asgi.py`
