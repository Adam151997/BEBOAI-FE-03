import { CrudService, type QueryParams } from "./crud.service";
import type { Document, DocumentsListResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

// FastAPI v2 documents router: /api/v2/documents/
// 
// INVESTIGATION (2025-11-24): The backend returns 404 Not Found for /api/v2/documents/
// This suggests the documents endpoint may not exist or uses a different path.
// Possible alternatives to investigate:
//   - /api/v2/files/
//   - /api/v2/attachments/
//   - /api/v2/docs/
// 
// Current implementation adds comprehensive error handling and logging to help diagnose
// the actual endpoint and error details. If the endpoint is confirmed to not exist,
// the UI will display a graceful error message to the user.
// 
// Standard CRUD endpoints (if implemented):
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

  // Override getAll to handle the custom documents response structure and add error handling
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Document>> {
    try {
      // Log the full request URL for debugging
      const fullUrl = apiClient.defaults.baseURL + this.endpoint;
      console.log('[Documents Service] Fetching documents from:', fullUrl);
      console.log('[Documents Service] Request params:', params);
      
      // Log auth headers for debugging (without exposing full token)
      const token = localStorage.getItem('access_token');
      const orgId = localStorage.getItem('org_id');
      console.log('[Documents Service] Auth status:', {
        hasToken: !!token,
        tokenPrefix: token ? token.substring(0, 20) + '...' : 'none',
        orgId: orgId || 'none',
      });

      const response = await apiClient.get<DocumentsListResponse>(this.endpoint, {
        params,
      });
      
      console.log('[Documents Service] Response status:', response.status);
      console.log('[Documents Service] Response data structure:', Object.keys(response.data));
      
      const data = response.data;
      
      // Try different possible response structures
      let allDocuments: Document[] = [];
      
      // Check for nested structure
      if (data.active_documents) {
        allDocuments = data.active_documents?.active_documents || data.active_documents?.documents || [];
        console.log('[Documents Service] Loaded from active_documents:', allDocuments.length);
      } else if (data.documents) {
        // Fallback to simple array response
        allDocuments = data.documents;
        console.log('[Documents Service] Loaded from documents:', allDocuments.length);
      } else {
        console.warn('[Documents Service] No documents found in response. Response structure:', Object.keys(data));
      }
      
      // Transform to standard paginated response format
      return {
        count: allDocuments.length,
        next: null,
        previous: null,
        results: allDocuments,
      };
    } catch (error) {
      // Enhanced error logging for 404 and other errors
      if (error instanceof AxiosError) {
        console.error('[Documents Service] API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullUrl: (error.config?.baseURL || '') + (error.config?.url || ''),
          method: error.config?.method?.toUpperCase(),
          headers: error.config?.headers,
          responseData: error.response?.data,
        });

        // Provide helpful error messages based on status code
        if (error.response?.status === 404) {
          console.error('[Documents Service] 404 Error: The documents endpoint does not exist on the backend.');
          console.error('[Documents Service] Attempted URL:', (error.config?.baseURL || '') + (error.config?.url || ''));
          console.error('[Documents Service] Please verify the correct backend API endpoint.');
          console.error('[Documents Service] Possible alternatives: /api/v2/files/, /api/v2/attachments/');
        }
      } else {
        console.error('[Documents Service] Unexpected error:', error);
      }
      
      // Re-throw the error so the UI can handle it
      throw error;
    }
  }

  async upload(file: File, title?: string): Promise<Document> {
    try {
      console.log('[Documents Service] Uploading document:', {
        fileName: file.name,
        fileSize: file.size,
        title,
      });

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
      
      console.log('[Documents Service] Upload successful:', response.status);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('[Documents Service] Upload Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          responseData: error.response?.data,
        });
      }
      throw error;
    }
  }
}

export const documentsService = new DocumentsService();
