import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { EVENT_TYPE_CHOICES, EVENT_STATUS_CHOICES } from "@/lib/constants";

interface EventFormProps {
  event?: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: event?.name || "",
    event_type: event?.event_type || "Call",
    status: event?.status || "Planned",
    start_date: event?.start_date || "",
    start_time: event?.start_time || "",
    end_date: event?.end_date || "",
    end_time: event?.end_time || "",
    description: event?.description || "",
    is_recurring: event?.is_recurring || false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Event>) => eventsService.create(data),
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
    mutationFn: (data: Partial<Event>) =>
      eventsService.update(event!.id, data),
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
    const cleanData: Partial<Event> = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== "")
    ) as Partial<Event>;

    // Add current user's profile_id to assigned_to array for new records
    const profileId = localStorage.getItem("profile_id");
    if (profileId && !event) {
      cleanData.assigned_to = [profileId];
    }

    if (event) {
      updateMutation.mutate(cleanData);
    } else {
      createMutation.mutate(cleanData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Event Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && Array.isArray(errors.name) && (
          <p className="text-sm text-destructive">{errors.name.join(", ")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_type">
            Event Type <span className="text-destructive">*</span>
          </Label>
          <Select
            id="event_type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
          >
            {EVENT_TYPE_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.event_type && Array.isArray(errors.event_type) && (
            <p className="text-sm text-destructive">{errors.event_type.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {EVENT_STATUS_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.status && Array.isArray(errors.status) && (
            <p className="text-sm text-destructive">{errors.status.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
          {errors.start_date && Array.isArray(errors.start_date) && (
            <p className="text-sm text-destructive">{errors.start_date.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
          />
          {errors.start_time && Array.isArray(errors.start_time) && (
            <p className="text-sm text-destructive">{errors.start_time.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
          />
          {errors.end_date && Array.isArray(errors.end_date) && (
            <p className="text-sm text-destructive">{errors.end_date.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
          />
          {errors.end_time && Array.isArray(errors.end_time) && (
            <p className="text-sm text-destructive">{errors.end_time.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
