import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { tasksService } from "@/services/tasks.service";
import type { Task } from "@/types";
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
import TaskForm from "@/components/tasks/TaskForm";
import TaskDetails from "@/components/tasks/TaskDetails";

export default function TasksList() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();

  // Reset page when route changes
  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  // Cleanup dialogs on unmount
  useEffect(() => {
    return () => {
      setIsCreateOpen(false);
      setIsEditOpen(false);
      setIsDetailsOpen(false);
      setSelectedTask(null);
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", location.pathname, page, limit, search],
    queryFn: () =>
      tasksService.getAll({
        limit,
        offset: (page - 1) * limit,
        search,
        ordering: "-created_at",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  // Normalize data to prevent runtime errors
  const results: Task[] = Array.isArray(data?.results) ? data.results : [];
  const totalCount = typeof data?.count === "number" ? data.count : 0;
  const totalPages = totalCount > 0 && limit > 0 ? Math.ceil(totalCount / limit) : 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "success"> = {
      new: "secondary",
      in_progress: "default",
      completed: "success",
    };
    return colors[status] || "secondary";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive"> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    };
    return colors[priority] || "secondary";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and to-dos</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
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
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error loading tasks</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(task)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task.id)}
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
                  {Math.min(page * limit, totalCount)} of {totalCount} results
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ["tasks"] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClose={() => setIsEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm
              task={selectedTask}
              onSuccess={() => {
                setIsEditOpen(false);
                setSelectedTask(null);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
              }}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent onClose={() => setIsDetailsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              onClose={() => {
                setIsDetailsOpen(false);
                setSelectedTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
