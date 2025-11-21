import { CrudService } from "./crud.service";
import { Opportunity } from "@/types";

class OpportunitiesService extends CrudService<Opportunity> {
  constructor() {
    super("/opportunities/");
  }
}

export const opportunitiesService = new OpportunitiesService();
