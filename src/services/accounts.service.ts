import { CrudService } from "./crud.service";
import { Account } from "@/types";
import apiClient from "@/lib/api-client";

class AccountsService extends CrudService<Account> {
  constructor() {
    super("/accounts/");
  }

  async createMail(id: string, mailData: any): Promise<any> {
    const response = await apiClient.post(`/accounts/${id}/create_mail/`, mailData);
    return response.data;
  }
}

export const accountsService = new AccountsService();
