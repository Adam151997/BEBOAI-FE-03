import { CrudService } from "./crud.service";
import type { Contact } from "@/types";

class ContactsService extends CrudService<Contact> {
  constructor() {
    super("/contacts/");
  }
}

export const contactsService = new ContactsService();
