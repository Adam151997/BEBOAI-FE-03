import { CrudService } from "./crud.service";
import type { Opportunity } from "@/types";

class OpportunitiesService extends CrudService<Opportunity> {
  constructor() {
    super("/opportunities/");
  }
}

export const opportunitiesService = new OpportunitiesService();
