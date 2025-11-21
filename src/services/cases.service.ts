import { CrudService } from "./crud.service";
import { Case } from "@/types";

class CasesService extends CrudService<Case> {
  constructor() {
    super("/cases/");
  }
}

export const casesService = new CasesService();
