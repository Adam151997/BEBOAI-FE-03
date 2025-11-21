import { CrudService } from "./crud.service";
import { Task } from "@/types";

class TasksService extends CrudService<Task> {
  constructor() {
    super("/tasks/");
  }
}

export const tasksService = new TasksService();
