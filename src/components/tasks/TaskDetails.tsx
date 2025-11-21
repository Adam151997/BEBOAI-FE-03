import type { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
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
      <div>
        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
        <div className="flex gap-2">
          <Badge variant={getStatusColor(task.status || "")}>
            {task.status?.replace("_", " ") || "N/A"}
          </Badge>
          <Badge variant={getPriorityColor(task.priority || "")}>
            {task.priority || "N/A"} priority
          </Badge>
        </div>
      </div>

      {task.due_date && (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="text-sm font-medium">
              {new Date(task.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {task.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {task.description}
          </p>
        </div>
      )}

      {task.assigned_to && task.assigned_to.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Assigned To</h4>
          <div className="space-y-2">
            {task.assigned_to.map((user) => (
              <div key={user.id} className="text-sm">
                {user.email}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {task.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(task.created_at)}</span>
          </div>
        )}
        {task.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(task.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
