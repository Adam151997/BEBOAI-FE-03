import { CrudService, type QueryParams } from "./crud.service";
import type { Task, TasksListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 tasks router: /api/v2/tasks/
// Matches apiv2/routers/tasks.py and apiv2/schemas/tasks.py
// 
// Standard CRUD endpoints:
// - GET    /tasks/                  → List tasks with pagination
// - POST   /tasks/                  → Create new task
// - GET    /tasks/{id}/             → Get single task
// - PUT    /tasks/{id}/             → Update task
// - PATCH  /tasks/{id}/             → Partial update
// - DELETE /tasks/{id}/             → Delete task
// - POST   /tasks/{id}/comments/    → Add comment
// - POST   /tasks/{id}/attachments/ → Add attachment
class TasksService extends CrudService<Task> {
  constructor() {
    super("/tasks/");
  }

  // Override getAll to handle the custom tasks response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<TasksListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allTasks: Task[] = [];
    
    // Check for nested structure
    if (data.active_tasks || data.completed_tasks) {
      allTasks = [
        ...(data.active_tasks?.active_tasks || data.active_tasks?.tasks || []),
        ...(data.completed_tasks?.completed_tasks || []),
      ];
    } else if (data.tasks) {
      // Fallback to simple array response
      allTasks = data.tasks;
    }
    
    // Transform to standard paginated response format
    return {
      count: allTasks.length,
      next: null,
      previous: null,
      results: allTasks,
    };
  }
}

export const tasksService = new TasksService();
