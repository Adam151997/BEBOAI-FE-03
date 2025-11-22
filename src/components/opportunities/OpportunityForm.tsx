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
    account: opportunity?.account?.toString() || "",
    stage: opportunity?.stage || "",
    amount: opportunity?.amount?.toString() || "",
    currency: opportunity?.currency || "USD",
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

    const data: any = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      probability: formData.probability ? parseInt(formData.probability) : undefined,
      account: formData.account ? parseInt(formData.account) : undefined,
    };

    // Filter out empty strings and undefined values - only send fields with actual values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
    );

    if (opportunity) {
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
          Opportunity Name <span className="text-destructive">*</span>
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
        <Label htmlFor="account">
          Account ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="account"
          name="account"
          type="number"
          value={formData.account}
          onChange={handleChange}
          required
          placeholder="Enter Account ID"
        />
        {errors.account && <p className="text-sm text-destructive">{errors.account}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <Select
          id="stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
        >
          <option value="">Select Stage</option>
          <option value="QUALIFICATION">Qualification</option>
          <option value="NEEDS ANALYSIS">Needs Analysis</option>
          <option value="VALUE PROPOSITION">Value Proposition</option>
          <option value="ID. DECISION MAKERS">ID. Decision Makers</option>
          <option value="PERCEPTION ANALYSIS">Perception Analysis</option>
          <option value="PROPOSAL/PRICE QUOTE">Proposal/Price Quote</option>
          <option value="NEGOTIATION/REVIEW">Negotiation/Review</option>
          <option value="CLOSED WON">Closed Won</option>
          <option value="CLOSED LOST">Closed Lost</option>
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
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
            <option value="JPY">JPY</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            placeholder="0-100"
          />
        </div>

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead_source">Lead Source</Label>
        <Select
          id="lead_source"
          name="lead_source"
          value={formData.lead_source}
          onChange={handleChange}
        >
          <option value="">Select Lead Source</option>
          <option value="None">None</option>
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Existing Customer">Existing Customer</option>
          <option value="Partner">Partner</option>
          <option value="Public Relations">Public Relations</option>
          <option value="Campaign">Campaign</option>
          <option value="Website">Website</option>
          <option value="Other">Other</option>
        </Select>
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
