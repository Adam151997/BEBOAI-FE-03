import { CrudService } from "./crud.service";
import { Lead } from "@/types";
import apiClient from "@/lib/api-client";

class LeadsService extends CrudService<Lead> {
  constructor() {
    super("/leads/");
  }

  async bulkUpload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/leads/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async createFromSite(data: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.post<Lead>("/leads/create-from-site/", data);
    return response.data;
  }
}

export const leadsService = new LeadsService();
