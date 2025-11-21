import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import EventForm from "@/components/events/EventForm";
import EventDetails from "@/components/events/EventDetails";

export default function EventsList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", page, limit, search],
    queryFn: () =>
      eventsService.getAll({
        limit,
        offset: (page - 1) * limit,
        search,
        ordering: "-created_at",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const totalPages = data ? Math.ceil(data.count / limit) : 0;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage meetings, calls, and activities</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error loading events</p>
          </div>
        ) : data?.results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No events found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.results.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(event.status || "")}>
                        {event.status?.replace("_", " ") || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(event.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {event.end_date
                        ? new Date(event.end_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, data?.count || 0)} of {data?.count} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ["events"] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClose={() => setIsEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              event={selectedEvent}
              onSuccess={() => {
                setIsEditOpen(false);
                setSelectedEvent(null);
                queryClient.invalidateQueries({ queryKey: ["events"] });
              }}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedEvent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent onClose={() => setIsDetailsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={() => {
                setIsDetailsOpen(false);
                setSelectedEvent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
