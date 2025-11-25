import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TASK_STATUS_CHOICES, TASK_PRIORITY_CHOICES } from "@/lib/constants";
import { normalizeIdArray } from "@/lib/utils";

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    status: task?.status || "open",
    priority: task?.priority || "medium",
    due_date: task?.due_date || "",
    description: task?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Task>) => tasksService.create(data),
    onSuccess,
    onError: (error: { response?: { data?: { errors?: Record<string, string[]> } } }) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        setErrors(error.response.data as Record<string, string[]>);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Task>) =>
      tasksService.update(task!.id, data),
    onSuccess,
    onError: (error: { response?: { data?: { errors?: Record<string, string[]> } } }) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        setErrors(error.response.data as Record<string, string[]>);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Filter out empty strings - only send fields with actual values
    const cleanData: Partial<Task> = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== "")
    ) as Partial<Task>;

    // Add current user's profile_id to assigned_to array for new records
    // NOTE: Backend requires assigned_to to be number[] - use normalizeIdArray to ensure proper type
    // Type assertion is needed because Task['assigned_to'] accepts User[] for response mapping
    // but the API create/update endpoints require number[] for submission
    const profileId = localStorage.getItem("profile_id");
    if (profileId && !task) {
      (cleanData as Record<string, unknown>).assigned_to = normalizeIdArray([profileId]);
    }

    if (task) {
      updateMutation.mutate(cleanData);
    } else {
      createMutation.mutate(cleanData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {errors.title && Array.isArray(errors.title) && (
          <p className="text-sm text-destructive">{errors.title.join(", ")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {TASK_STATUS_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.status && Array.isArray(errors.status) && (
            <p className="text-sm text-destructive">{errors.status.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">
            Priority <span className="text-destructive">*</span>
          </Label>
          <Select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            {TASK_PRIORITY_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.priority && Array.isArray(errors.priority) && (
            <p className="text-sm text-destructive">{errors.priority.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
        />
        {errors.due_date && Array.isArray(errors.due_date) && (
          <p className="text-sm text-destructive">{errors.due_date.join(", ")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
        {errors.description && Array.isArray(errors.description) && (
          <p className="text-sm text-destructive">{errors.description.join(", ")}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
