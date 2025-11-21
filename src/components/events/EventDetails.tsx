import type { Event } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Repeat } from "lucide-react";

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
      planned: "secondary",
      held: "success",
      not_held: "destructive",
      not_started: "outline",
    };
    return colors[status] || "secondary";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive"> = {
      meeting: "default",
      call: "secondary",
      task: "default",
      deadline: "destructive",
    };
    return colors[type] || "default";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
        <div className="flex gap-2">
          <Badge variant={getTypeColor(event.event_type)}>
            {event.event_type}
          </Badge>
          <Badge variant={getStatusColor(event.status || "")}>
            {event.status?.replace("_", " ") || "N/A"}
          </Badge>
          {event.is_recurring && (
            <Badge variant="outline">
              <Repeat className="h-3 w-3 mr-1" />
              Recurring
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Start Date</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">
              {formatDateTime(event.start_date)}
            </p>
          </div>
        </div>

        {event.end_date && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">End Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                {formatDateTime(event.end_date)}
              </p>
            </div>
          </div>
        )}
      </div>

      {event.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      )}

      {event.assigned_to && event.assigned_to.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Assigned To</h4>
          <div className="space-y-2">
            {event.assigned_to.map((user) => (
              <div key={user.id} className="text-sm">
                {user.email}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {event.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(event.created_at)}</span>
          </div>
        )}
        {event.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(event.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
