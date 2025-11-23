import { CrudService, type QueryParams } from "./crud.service";
import type { Contact, ContactsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 contacts router: /api/v2/contacts/
// Matches apiv2/routers/contacts.py and apiv2/schemas/contacts.py
class ContactsService extends CrudService<Contact> {
  constructor() {
    super("/contacts/");
  }

  // Override getAll to handle the custom contacts response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Contact>> {
    const response = await apiClient.get<ContactsListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allContacts: Contact[] = [];
    
    // Check for nested structure
    if (data.active_contacts || data.closed_contacts) {
      allContacts = [
        ...(data.active_contacts?.active_contacts || data.active_contacts?.contacts || []),
        ...(data.closed_contacts?.close_contacts || data.closed_contacts?.closed_contacts || []),
      ];
    } else if (data.contacts) {
      // Fallback to simple array response
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
}

export const contactsService = new ContactsService();
