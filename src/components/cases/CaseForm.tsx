import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { casesService } from "@/services/cases.service";
import type { Case } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface CaseFormProps {
  case?: Case;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CaseForm({ case: caseItem, onSuccess, onCancel }: CaseFormProps) {
  const [formData, setFormData] = useState({
    name: caseItem?.name || "",
    status: caseItem?.status || "New",
    priority: caseItem?.priority || "Medium",
    case_type: caseItem?.case_type || "",
    description: caseItem?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Case>) => casesService.create(data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Case>) =>
      casesService.update(caseItem!.id, data),
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
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
            <option value="Problem">Problem</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Data Corrupted">Data Corrupted</option>
            <option value="Functionality Request">Functionality Request</option>
            <option value="Integration">Integration</option>
            <option value="Others">Others</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Working">Working</option>
          <option value="Closed">Closed</option>
          <option value="Rejected">Rejected</option>
          <option value="Duplicate">Duplicate</option>
        </Select>
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
