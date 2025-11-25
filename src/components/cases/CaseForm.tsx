import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { casesService } from "@/services/cases.service";
import type { Case } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  CASE_STATUS_CHOICES,
  CASE_PRIORITY_CHOICES,
  CASE_TYPE_CHOICES,
} from "@/lib/constants";
import { normalizeIdArray } from "@/lib/utils";

interface CaseFormProps {
  case?: Case;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CaseForm({ case: caseItem, onSuccess, onCancel }: CaseFormProps) {
  const [formData, setFormData] = useState({
    name: caseItem?.name || "",
    status: caseItem?.status || "open",
    priority: caseItem?.priority || "medium",
    case_type: caseItem?.case_type || "",
    closed_on: caseItem?.closed_on || "",
    description: caseItem?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Case>) => casesService.create(data),
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
    mutationFn: (data: Partial<Case>) =>
      casesService.update(caseItem!.id, data),
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
    const cleanData: Partial<Case> = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== "")
    ) as Partial<Case>;

    // Add current user's profile_id to assigned_to array for new records
    // NOTE: Backend requires assigned_to to be number[] - use normalizeIdArray to ensure proper type
    // Type assertion is needed because Case['assigned_to'] accepts User[] for response mapping
    // but the API create/update endpoints require number[] for submission
    const profileId = localStorage.getItem("profile_id");
    if (profileId && !caseItem) {
      (cleanData as Record<string, unknown>).assigned_to = normalizeIdArray([profileId]);
    }

    if (caseItem) {
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
        <Label htmlFor="name">
          Case Name <span className="text-destructive">*</span>
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
            {CASE_STATUS_CHOICES.map((choice) => (
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
            {CASE_PRIORITY_CHOICES.map((choice) => (
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="case_type">Type</Label>
          <Select
            id="case_type"
            name="case_type"
            value={formData.case_type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {CASE_TYPE_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.case_type && Array.isArray(errors.case_type) && (
            <p className="text-sm text-destructive">{errors.case_type.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="closed_on">
            Closed On <span className="text-destructive">*</span>
          </Label>
          <Input
            id="closed_on"
            name="closed_on"
            type="date"
            value={formData.closed_on}
            onChange={handleChange}
            required
          />
          {errors.closed_on && Array.isArray(errors.closed_on) && (
            <p className="text-sm text-destructive">{errors.closed_on.join(", ")}</p>
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
          {isLoading ? "Saving..." : caseItem ? "Update Case" : "Create Case"}
        </Button>
      </div>
    </form>
  );
}
