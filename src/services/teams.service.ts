import { CrudService } from "./crud.service";
import { Team } from "@/types";

class TeamsService extends CrudService<Team> {
  constructor() {
    super("/teams/");
  }
}

export const teamsService = new TeamsService();
