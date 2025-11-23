import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { opportunitiesService } from "@/services/opportunities.service";
import { accountsService } from "@/services/accounts.service";
import { contactsService } from "@/services/contacts.service";
import type { Opportunity } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  OPPORTUNITY_STAGE_CHOICES,
  OPPORTUNITY_LEAD_SOURCE_CHOICES,
  CURRENCY_CHOICES,
} from "@/lib/constants";

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
    contacts: "",
    // Note: leads field is commented out since Opportunity type doesn't include it
    // If backend supports it, uncomment the line below
    // leads: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Fetch accounts for dropdown
  const { data: accountsData } = useQuery({
    queryKey: ["accounts", "for-opportunity-form"],
    queryFn: () => accountsService.getAll({ limit: 100, offset: 0, search: "", ordering: "-created_at" }),
  });

  // Fetch contacts for multiselect
  const { data: contactsData } = useQuery({
    queryKey: ["contacts", "for-opportunity-form"],
    queryFn: () => contactsService.getAll({ limit: 100, offset: 0, search: "", ordering: "-created_at" }),
  });

  // Note: Fetch leads if backend adds leads support to opportunities
  // const { data: leadsData } = useQuery({
  //   queryKey: ["leads", "for-opportunity-form"],
  //   queryFn: () => leadsService.getAll({ limit: 100, offset: 0, search: "", ordering: "-created_at" }),
  // });

  const accountOptions = Array.isArray(accountsData?.results) ? accountsData.results : [];
  const contactOptions = Array.isArray(contactsData?.results) ? contactsData.results : [];
  // Note: leadOptions available if backend adds leads support to opportunities
  // const leadOptions = Array.isArray(leadsData?.results) ? leadsData.results : [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<Opportunity>) => opportunitiesService.create(data),
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
    mutationFn: (data: Partial<Opportunity>) =>
      opportunitiesService.update(opportunity!.id, data),
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

    // Build clean data object with proper types
    const cleanData: Partial<Opportunity> = {};
    
    if (formData.name) cleanData.name = formData.name;
    if (formData.stage) cleanData.stage = formData.stage as Opportunity['stage'];
    if (formData.currency) cleanData.currency = formData.currency as Opportunity['currency'];
    if (formData.close_date) cleanData.close_date = formData.close_date;
    if (formData.lead_source) cleanData.lead_source = formData.lead_source;
    if (formData.description) cleanData.description = formData.description;
    
    if (formData.amount) cleanData.amount = parseFloat(formData.amount);
    if (formData.probability) cleanData.probability = parseInt(formData.probability);
    if (formData.account) cleanData.account = parseInt(formData.account);
    
    // Handle contacts array (comma-separated IDs)
    if (formData.contacts) {
      const contactIds = formData.contacts.split(',').map(id => id.trim()).filter(id => id);
      if (contactIds.length > 0) cleanData.contacts = contactIds;
    }

    // Add current user's profile_id to assigned_to array for new records
    const profileId = localStorage.getItem("profile_id");
    if (profileId && !opportunity) {
      cleanData.assigned_to = [profileId];
    }

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
        {errors.name && Array.isArray(errors.name) && (
          <p className="text-sm text-destructive">{errors.name.join(", ")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="account">
          Company <span className="text-destructive">*</span>
        </Label>
        <Select
          id="account"
          name="account"
          value={formData.account}
          onChange={handleChange}
          required
        >
          <option value="">Select company</option>
          {accountOptions.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </Select>
        {errors.account && Array.isArray(errors.account) && (
          <p className="text-sm text-destructive">{errors.account.join(", ")}</p>
        )}
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
          {OPPORTUNITY_STAGE_CHOICES.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </Select>
        {errors.stage && Array.isArray(errors.stage) && (
          <p className="text-sm text-destructive">{errors.stage.join(", ")}</p>
        )}
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
          {errors.amount && Array.isArray(errors.amount) && (
            <p className="text-sm text-destructive">{errors.amount.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          >
            {CURRENCY_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.currency && Array.isArray(errors.currency) && (
            <p className="text-sm text-destructive">{errors.currency.join(", ")}</p>
          )}
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
          {errors.probability && Array.isArray(errors.probability) && (
            <p className="text-sm text-destructive">{errors.probability.join(", ")}</p>
          )}
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
          {errors.close_date && Array.isArray(errors.close_date) && (
            <p className="text-sm text-destructive">{errors.close_date.join(", ")}</p>
          )}
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
          {OPPORTUNITY_LEAD_SOURCE_CHOICES.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </Select>
        {errors.lead_source && Array.isArray(errors.lead_source) && (
          <p className="text-sm text-destructive">{errors.lead_source.join(", ")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contacts">Contacts (Optional)</Label>
        <Input
          id="contacts"
          name="contacts"
          value={formData.contacts}
          onChange={handleChange}
          placeholder="Enter contact IDs (comma-separated)"
        />
        <p className="text-xs text-muted-foreground">
          Available contacts: {contactOptions.map(c => `${c.first_name} ${c.last_name || ''} (${c.id})`).slice(0, 3).join(', ')}
          {contactOptions.length > 3 && `, +${contactOptions.length - 3} more`}
        </p>
        {errors.contacts && Array.isArray(errors.contacts) && (
          <p className="text-sm text-destructive">{errors.contacts.join(", ")}</p>
        )}
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
        {errors.description && Array.isArray(errors.description) && (
          <p className="text-sm text-destructive">{errors.description.join(", ")}</p>
        )}
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
