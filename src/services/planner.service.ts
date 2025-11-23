import apiClient from "@/lib/api-client";
import type { QueryParams } from "./crud.service";
import type {
  PlannerEventResponse,
  PlannerEventCreate,
  PlannerEventUpdate,
  PlannerEventListResponse,
  PlannerHistoryResponse,
  PlannerCommentCreate,
  PlannerAttachmentResponse,
  ReminderResponse,
  ReminderCreate,
  PlannerEventStatus,
} from "@/types/planner";
import type { PaginatedResponse, CommentResponse } from "@/types";

// FastAPI v2 planner router: /api/v2/planner/
// Matches apiv2/routers/planner.py and apiv2/schemas/planner.py
class PlannerService {
  private endpoint = "/planner/";

  // Get all planner events with pagination
  async getAll(params?: QueryParams): Promise<PaginatedResponse<PlannerEventResponse>> {
    const response = await apiClient.get<PlannerEventListResponse>(this.endpoint, {
      params,
    });

    const data = response.data;

    // Transform FastAPI v2 response to standard paginated format for component compatibility
    return {
      count: data.events_count || 0,
      next: null,
      previous: null,
      results: data.events || [],
    };
  }

  // Get a single planner event by ID
  async getOne(id: string): Promise<PlannerEventResponse> {
    const response = await apiClient.get<PlannerEventResponse>(`${this.endpoint}${id}/`);
    return response.data;
  }

  // Create a new planner event
  async create(data: PlannerEventCreate): Promise<PlannerEventResponse> {
    const response = await apiClient.post<PlannerEventResponse>(this.endpoint, data);
    return response.data;
  }

  // Update an existing planner event (full update)
  async update(id: string, data: PlannerEventUpdate): Promise<PlannerEventResponse> {
    const response = await apiClient.put<PlannerEventResponse>(
      `${this.endpoint}${id}/`,
      data
    );
    return response.data;
  }

  // Partial update of a planner event
  async partialUpdate(
    id: string,
    data: Partial<PlannerEventUpdate>
  ): Promise<PlannerEventResponse> {
    const response = await apiClient.patch<PlannerEventResponse>(
      `${this.endpoint}${id}/`,
      data
    );
    return response.data;
  }

  // Delete a planner event
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}${id}/`);
  }

  // Get planner event history
  async getHistory(id: string): Promise<PlannerHistoryResponse[]> {
    const response = await apiClient.get<PlannerHistoryResponse[]>(
      `${this.endpoint}${id}/history/`
    );
    return response.data;
  }

  // Add a comment to a planner event
  async addComment(id: string, comment: string): Promise<CommentResponse> {
    const payload: PlannerCommentCreate = { comment };
    const response = await apiClient.post<CommentResponse>(
      `${this.endpoint}${id}/comments/`,
      payload
    );
    return response.data;
  }

  // Get comments for a planner event
  async getComments(id: string): Promise<CommentResponse[]> {
    const response = await apiClient.get<CommentResponse[]>(
      `${this.endpoint}${id}/comments/`
    );
    return response.data;
  }

  // Add an attachment to a planner event
  async addAttachment(id: string, file: File): Promise<PlannerAttachmentResponse> {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await apiClient.post<PlannerAttachmentResponse>(
      `${this.endpoint}${id}/attachments/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Get attachments for a planner event
  async getAttachments(id: string): Promise<PlannerAttachmentResponse[]> {
    const response = await apiClient.get<PlannerAttachmentResponse[]>(
      `${this.endpoint}${id}/attachments/`
    );
    return response.data;
  }

  // Reminder management
  async addReminder(id: string, reminder: ReminderCreate): Promise<ReminderResponse> {
    const response = await apiClient.post<ReminderResponse>(
      `${this.endpoint}${id}/reminders/`,
      reminder
    );
    return response.data;
  }

  async getReminders(id: string): Promise<ReminderResponse[]> {
    const response = await apiClient.get<ReminderResponse[]>(
      `${this.endpoint}${id}/reminders/`
    );
    return response.data;
  }

  async deleteReminder(eventId: string, reminderId: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}${eventId}/reminders/${reminderId}/`);
  }

  // Update event status
  async updateStatus(id: string, status: PlannerEventStatus): Promise<PlannerEventResponse> {
    const response = await apiClient.patch<PlannerEventResponse>(
      `${this.endpoint}${id}/`,
      { status }
    );
    return response.data;
  }

  // Get events by date range (if backend supports this endpoint)
  async getEventsByDateRange(
    startDate: string,
    endDate: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<PlannerEventResponse>> {
    const response = await apiClient.get<PlannerEventListResponse>(this.endpoint, {
      params: {
        ...params,
        start_date: startDate,
        end_date: endDate,
      },
    });

    const data = response.data;

    return {
      count: data.events_count || 0,
      next: null,
      previous: null,
      results: data.events || [],
    };
  }
}

export const plannerService = new PlannerService();
