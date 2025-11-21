import { CrudService } from "./crud.service";
import { Document } from "@/types";
import apiClient from "@/lib/api-client";

class DocumentsService extends CrudService<Document> {
  constructor() {
    super("/documents/");
  }

  async upload(file: File, title?: string): Promise<Document> {
    const formData = new FormData();
    formData.append("document_file", file);
    if (title) {
      formData.append("title", title);
    }

    const response = await apiClient.post<Document>("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export const documentsService = new DocumentsService();
