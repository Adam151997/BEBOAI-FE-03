import { CrudService, type QueryParams } from "./crud.service";
import type { Document, DocumentsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";

// FastAPI v2 documents router: /api/v2/documents/
// Note: Verify if documents router exists in apiv2/routers/ or if this uses a different endpoint
// 
// Standard CRUD endpoints:
// - GET    /documents/                  → List documents with pagination
// - POST   /documents/                  → Upload new document
// - GET    /documents/{id}/             → Get single document
// - PUT    /documents/{id}/             → Update document
// - PATCH  /documents/{id}/             → Partial update
// - DELETE /documents/{id}/             → Delete document
class DocumentsService extends CrudService<Document> {
  constructor() {
    super("/documents/");
  }

  // Override getAll to handle the custom documents response structure
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Document>> {
    const response = await apiClient.get<DocumentsListResponse>(this.endpoint, {
      params,
    });
    
    const data = response.data;
    
    // Try different possible response structures
    let allDocuments: Document[] = [];
    
    // Check for nested structure
    if (data.active_documents) {
      allDocuments = data.active_documents?.active_documents || data.active_documents?.documents || [];
    } else if (data.documents) {
      // Fallback to simple array response
      allDocuments = data.documents;
    }
    
    // Transform to standard paginated response format
    return {
      count: allDocuments.length,
      next: null,
      previous: null,
      results: allDocuments,
    };
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
