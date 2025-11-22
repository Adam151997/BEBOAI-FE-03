import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { contactsService } from "@/services/contacts.service";
import type { Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface ContactFormProps {
  contact?: Contact;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    salutation: contact?.salutation || "",
    first_name: contact?.first_name || "",
    last_name: contact?.last_name || "",
    organization: contact?.organization || "",
    title: contact?.title || "",
    primary_email: contact?.primary_email || "",
    secondary_email: contact?.secondary_email || "",
    mobile_number: contact?.mobile_number || "",
    secondary_number: contact?.secondary_number || "",
    department: contact?.department || "",
    date_of_birth: contact?.date_of_birth || "",
    address: contact?.address || "",
    city: contact?.city || "",
    state: contact?.state || "",
    postcode: contact?.postcode || "",
    country: contact?.country || "",
    description: contact?.description || "",
    linked_in_url: contact?.linked_in_url || "",
    facebook_url: contact?.facebook_url || "",
    twitter_username: contact?.twitter_username || "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const createMutation = useMutation({
    mutationFn: (data: Partial<Contact>) => contactsService.create(data),
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
    mutationFn: (data: Partial<Contact>) =>
      contactsService.update(contact!.id, data),
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
    if (profileId && !contact) {
      cleanData.assigned_to = [profileId];
    }

    if (contact) {
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
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salutation">Salutation</Label>
          <Select
            id="salutation"
            name="salutation"
            value={formData.salutation}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
            <option value="Dr">Dr</option>
          </Select>
        </div>

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
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title (Job Title)</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Manager, Director"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primary_email">Primary Email</Label>
          <Input
            id="primary_email"
            name="primary_email"
            type="email"
            value={formData.primary_email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary_email">Secondary Email</Label>
          <Input
            id="secondary_email"
            name="secondary_email"
            type="email"
            value={formData.secondary_email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mobile_number">Mobile Number</Label>
          <Input
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary_number">Secondary Number</Label>
          <Input
            id="secondary_number"
            name="secondary_number"
            value={formData.secondary_number}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linked_in_url">LinkedIn URL</Label>
          <Input
            id="linked_in_url"
            name="linked_in_url"
            type="url"
            value={formData.linked_in_url}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_url">Facebook URL</Label>
          <Input
            id="facebook_url"
            name="facebook_url"
            type="url"
            value={formData.facebook_url}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter_username">Twitter Username</Label>
        <Input
          id="twitter_username"
          name="twitter_username"
          value={formData.twitter_username}
          onChange={handleChange}
          placeholder="@username"
        />
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
          {isLoading ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  );
}
