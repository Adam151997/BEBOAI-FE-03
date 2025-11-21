import { CrudService } from "./crud.service";
import { Event } from "@/types";

class EventsService extends CrudService<Event> {
  constructor() {
    super("/events/");
  }
}

export const eventsService = new EventsService();
