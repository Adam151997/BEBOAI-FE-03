import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface EventFormProps {
  event?: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: event?.name || "",
    event_type: event?.event_type || "Non-Recurring",
    status: event?.status || "planned",
    start_date: event?.start_date || "",
    start_time: event?.start_time || "",
    end_date: event?.end_date || "",
    end_time: event?.end_time || "",
    description: event?.description || "",
    is_recurring: event?.is_recurring || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Event>) => eventsService.create(data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Event>) =>
      eventsService.update(event!.id, data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Filter out empty strings - only send fields with actual values
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );

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
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
            <option value="Non-Recurring">Non-Recurring</option>
            <option value="Recurring">Recurring</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="planned">Planned</option>
            <option value="held">Held</option>
            <option value="not_held">Not Held</option>
            <option value="not_started">Not Started</option>
          </Select>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">
            Start Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="end_date">
            End Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">
            End Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
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
