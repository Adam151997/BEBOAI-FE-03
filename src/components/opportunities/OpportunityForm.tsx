import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { opportunitiesService } from "@/services/opportunities.service";
import type { Opportunity } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface OpportunityFormProps {
  opportunity?: Opportunity;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OpportunityForm({ opportunity, onSuccess, onCancel }: OpportunityFormProps) {
  const [formData, setFormData] = useState({
    name: opportunity?.name || "",
    stage: opportunity?.stage || "prospecting",
    amount: opportunity?.amount?.toString() || "",
    probability: opportunity?.probability?.toString() || "",
    close_date: opportunity?.close_date || "",
    lead_source: opportunity?.lead_source || "",
    description: opportunity?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Opportunity>) => opportunitiesService.create(data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Opportunity>) =>
      opportunitiesService.update(opportunity!.id, data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      probability: formData.probability ? parseInt(formData.probability) : undefined,
    };

    if (opportunity) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
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
          Name <span className="text-destructive">*</span>
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

      <div className="space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <Select
          id="stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
        >
          <option value="prospecting">Prospecting</option>
          <option value="qualification">Qualification</option>
          <option value="needs-analysis">Needs Analysis</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed-won">Closed Won</option>
          <option value="closed-lost">Closed Lost</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            name="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="close_date">Close Date</Label>
          <Input
            id="close_date"
            name="close_date"
            type="date"
            value={formData.close_date}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead_source">Lead Source</Label>
          <Input
            id="lead_source"
            name="lead_source"
            value={formData.lead_source}
            onChange={handleChange}
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
          {isLoading ? "Saving..." : opportunity ? "Update Opportunity" : "Create Opportunity"}
        </Button>
      </div>
    </form>
  );
}
