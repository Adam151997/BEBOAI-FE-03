import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { leadsService } from "@/services/leads.service";
import { accountsService } from "@/services/accounts.service";
import type { Lead, Account } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LEAD_STATUS_CHOICES, LEAD_SOURCE_CHOICES } from "@/lib/constants";

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState({
    title: lead?.title || "",
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    status: lead?.status || "",
    source: lead?.source || "",
    company: lead?.company || "",
    website: lead?.website || "",
    address_line: lead?.address_line || "",
    city: lead?.city || "",
    state: lead?.state || "",
    postcode: lead?.postcode || "",
    country: lead?.country || "",
    description: lead?.description || "",
    probability: lead?.probability?.toString() || "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Fetch accounts for the company dropdown
  const { data: accountsData } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Lead>) => leadsService.create(data),
    onSuccess,
    onError: (error: { response?: { data?: { errors?: Record<string, string[]> } } }) => {
      console.error("Lead creation error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        // Backend may return errors at root level
        setErrors(error.response.data as Record<string, string[]>);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Lead>) =>
      leadsService.update(lead!.id, data),
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

    // Convert probability to number
    const probability = formData.probability ? parseFloat(formData.probability) : undefined;

    // Build clean data object with proper types
    const cleanData: Partial<Lead> = {};
    
    // Add string fields
    if (formData.title) cleanData.title = formData.title;
    if (formData.first_name) cleanData.first_name = formData.first_name;
    if (formData.last_name) cleanData.last_name = formData.last_name;
    if (formData.email) cleanData.email = formData.email;
    if (formData.phone) cleanData.phone = formData.phone;
    if (formData.website) cleanData.website = formData.website;
    if (formData.address_line) cleanData.address_line = formData.address_line;
    if (formData.city) cleanData.city = formData.city;
    if (formData.state) cleanData.state = formData.state;
    if (formData.postcode) cleanData.postcode = formData.postcode;
    if (formData.country) cleanData.country = formData.country;
    if (formData.description) cleanData.description = formData.description;
    if (formData.company) cleanData.company = formData.company;
    if (formData.source) cleanData.source = formData.source;
    
    // Add status with proper type
    if (formData.status) {
      cleanData.status = formData.status as Lead['status'];
    }
    
    // Add probability
    if (probability !== undefined) {
      cleanData.probability = probability;
    }

    // CRITICAL: Add current user's profile_id to assigned_to array
    // This ensures the user can see the lead they created
    const profileId = localStorage.getItem("profile_id");
    if (profileId && !lead) {
      // Only add for new leads, not updates
      cleanData.assigned_to = [profileId];
    }

    console.log("Submitting lead data:", cleanData);
    console.log("Profile ID (assigned_to):", profileId);

    if (lead) {
      updateMutation.mutate(cleanData);
    } else {
      createMutation.mutate(cleanData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
          Title (Job Title) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Sales Manager, VP Marketing"
          required
        />
        {errors.title && Array.isArray(errors.title) && (
          <p className="text-sm text-destructive">{errors.title.join(", ")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          {errors.first_name && Array.isArray(errors.first_name) && (
            <p className="text-sm text-destructive">{errors.first_name.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          {errors.last_name && Array.isArray(errors.last_name) && (
            <p className="text-sm text-destructive">{errors.last_name.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && Array.isArray(errors.email) && (
            <p className="text-sm text-destructive">{errors.email.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1234567890"
          />
          {errors.phone && Array.isArray(errors.phone) && (
            <p className="text-sm text-destructive">{errors.phone.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            {LEAD_STATUS_CHOICES.map((choice) => (
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
          <Label htmlFor="source">Source</Label>
          <Select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="">Select Source</option>
            {LEAD_SOURCE_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </Select>
          {errors.source && Array.isArray(errors.source) && (
            <p className="text-sm text-destructive">{errors.source.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company (Account)</Label>
          <Select
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={!accountsData?.results}
          >
            <option value="">
              {accountsData?.results ? "Select Account" : "Loading accounts..."}
            </option>
            {accountsData?.results?.map((account: Account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground">
            Select an existing account or leave blank
          </p>
          {errors.company && Array.isArray(errors.company) && (
            <p className="text-sm text-destructive">{errors.company.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
          {errors.website && Array.isArray(errors.website) && (
            <p className="text-sm text-destructive">{errors.website.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line">Address</Label>
        <Input
          id="address_line"
          name="address_line"
          value={formData.address_line}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="probability">
          Probability (%) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="probability"
          name="probability"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.probability}
          onChange={handleChange}
          placeholder="0-100"
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter a value between 0 and 100 representing the likelihood of conversion
        </p>
        {errors.probability && Array.isArray(errors.probability) && (
          <p className="text-sm text-destructive">{errors.probability.join(", ")}</p>
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
          {isLoading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}
