import { CrudService, type QueryParams } from "./crud.service";
import type { Event, EventsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 events router: /api/v2/events/
// Matches apiv2/routers/events.py and apiv2/schemas/events.py
// 
// Standard CRUD endpoints:
// - GET    /events/                  → List events with pagination
// - POST   /events/                  → Create new event
// - GET    /events/{id}/             → Get single event
// - PUT    /events/{id}/             → Update event
// - PATCH  /events/{id}/             → Partial update
// - DELETE /events/{id}/             → Delete event
// - POST   /events/{id}/comments/    → Add comment
// - POST   /events/{id}/attachments/ → Add attachment
class EventsService extends CrudService<Event> {
  constructor() {
    super("/events/");
  }

  // Override getAll to handle the custom events response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Event>> {
    const response = await apiClient.get<EventsListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allEvents: Event[] = [];
    
    // Check for nested structure
    if (data.active_events || data.completed_events) {
      allEvents = [
        ...(data.active_events?.active_events || data.active_events?.events || []),
        ...(data.completed_events?.completed_events || []),
      ];
    } else if (data.events) {
      // Fallback to simple array response
      allEvents = data.events;
    }
    
    // Transform to standard paginated response format
    return {
      count: allEvents.length,
      next: null,
      previous: null,
      results: allEvents,
    };
  }
}

export const eventsService = new EventsService();
