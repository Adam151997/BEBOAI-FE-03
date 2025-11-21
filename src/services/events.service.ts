import { CrudService } from "./crud.service";
import type { Event } from "@/types";

class EventsService extends CrudService<Event> {
  constructor() {
    super("/events/");
  }
}

export const eventsService = new EventsService();
