import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { accountsService } from "@/services/accounts.service";
import type { Account } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ACCOUNT_STATUS_CHOICES } from "@/lib/constants";

interface AccountFormProps {
  account?: Account;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AccountForm({ account, onSuccess, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    email: account?.email || "",
    phone: account?.phone || "",
    industry: account?.industry || "",
    website: account?.website || "",
    status: account?.status || "",
    billing_address_line: account?.billing_address_line || "",
    billing_street: account?.billing_street || "",
    billing_city: account?.billing_city || "",
    billing_state: account?.billing_state || "",
    billing_postcode: account?.billing_postcode || "",
    billing_country: account?.billing_country || "",
    description: account?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Account>) => accountsService.create(data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        setErrors(error.response.data);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Account>) =>
      accountsService.update(account!.id, data),
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        setErrors(error.response.data);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Filter out empty strings - only send fields with actual values
    const cleanData: any = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );

    // Add current user's profile_id to assigned_to array for new records
    const profileId = localStorage.getItem("profile_id");
    if (profileId && !account) {
      cleanData.assigned_to = [profileId];
    }

    if (account) {
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
          Account Name <span className="text-destructive">*</span>
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && Array.isArray(errors.phone) && (
            <p className="text-sm text-destructive">{errors.phone.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
          />
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
          <option value="">Select Status</option>
          {ACCOUNT_STATUS_CHOICES.map((choice) => (
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
        <Label htmlFor="billing_address_line">
          Billing Address Line <span className="text-destructive">*</span>
        </Label>
        <Input
          id="billing_address_line"
          name="billing_address_line"
          value={formData.billing_address_line}
          onChange={handleChange}
          required
        />
        {errors.billing_address_line && Array.isArray(errors.billing_address_line) && (
          <p className="text-sm text-destructive">{errors.billing_address_line.join(", ")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="billing_street">
          Billing Street <span className="text-destructive">*</span>
        </Label>
        <Input
          id="billing_street"
          name="billing_street"
          value={formData.billing_street}
          onChange={handleChange}
          required
        />
        {errors.billing_street && Array.isArray(errors.billing_street) && (
          <p className="text-sm text-destructive">{errors.billing_street.join(", ")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billing_city">
            Billing City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="billing_city"
            name="billing_city"
            value={formData.billing_city}
            onChange={handleChange}
            required
          />
          {errors.billing_city && Array.isArray(errors.billing_city) && (
            <p className="text-sm text-destructive">{errors.billing_city.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billing_state">
            Billing State <span className="text-destructive">*</span>
          </Label>
          <Input
            id="billing_state"
            name="billing_state"
            value={formData.billing_state}
            onChange={handleChange}
            required
          />
          {errors.billing_state && Array.isArray(errors.billing_state) && (
            <p className="text-sm text-destructive">{errors.billing_state.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billing_postcode">
            Billing Postcode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="billing_postcode"
            name="billing_postcode"
            value={formData.billing_postcode}
            onChange={handleChange}
            required
          />
          {errors.billing_postcode && Array.isArray(errors.billing_postcode) && (
            <p className="text-sm text-destructive">{errors.billing_postcode.join(", ")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billing_country">
            Billing Country <span className="text-destructive">*</span>
          </Label>
          <Input
            id="billing_country"
            name="billing_country"
            value={formData.billing_country}
            onChange={handleChange}
            required
          />
          {errors.billing_country && Array.isArray(errors.billing_country) && (
            <p className="text-sm text-destructive">{errors.billing_country.join(", ")}</p>
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
          {isLoading ? "Saving..." : account ? "Update Account" : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
