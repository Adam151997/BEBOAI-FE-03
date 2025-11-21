import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { documentsService } from "@/services/documents.service";
import type { Document } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface DocumentFormProps {
  document?: Document;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DocumentForm({ document, onSuccess, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    title: document?.title || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; file?: File }) => {
      const formDataToSend = new FormData();
      if (data.title) formDataToSend.append("title", data.title);
      if (data.file) formDataToSend.append("document_file", data.file);

      return documentsService.create(formDataToSend as any);
    },
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; file?: File }) => {
      const formDataToSend = new FormData();
      if (data.title) formDataToSend.append("title", data.title);
      if (data.file) formDataToSend.append("document_file", data.file);

      return documentsService.update(document!.id, formDataToSend as any);
    },
    onSuccess,
    onError: (error: any) => {
      if (error.response?.data) setErrors(error.response.data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (document) {
      updateMutation.mutate({ title: formData.title, file: selectedFile || undefined });
    } else {
      if (!selectedFile) {
        setErrors({ file: "Please select a file to upload" });
        return;
      }
      createMutation.mutate({ title: formData.title, file: selectedFile });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // If no title is set, use the filename as the title
      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: e.target.files![0].name,
        }));
      }
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Document Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Contract Agreement, Invoice, Presentation"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="document_file">
          {document ? "Replace File (optional)" : "Upload File *"}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="document_file"
            name="document_file"
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
        {document?.document_file && !selectedFile && (
          <p className="text-sm text-muted-foreground">
            Current file: <a href={document.document_file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>
          </p>
        )}
        {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
        {errors.document_file && <p className="text-sm text-destructive">{errors.document_file}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : document ? "Update Document" : "Upload Document"}
        </Button>
      </div>
    </form>
  );
}
