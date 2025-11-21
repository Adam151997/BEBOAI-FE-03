import type { Case } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

interface CaseDetailsProps {
  case: Case;
  onClose: () => void;
}

export default function CaseDetails({ case: caseItem }: CaseDetailsProps) {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive"> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    };
    return colors[priority] || "secondary";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive"> = {
      problem: "destructive",
      feature_request: "default",
      question: "secondary",
      bug: "destructive",
    };
    return colors[type] || "default";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{caseItem.name}</h3>
        <div className="flex gap-2">
          {caseItem.case_type && (
            <Badge variant={getTypeColor(caseItem.case_type)}>
              {caseItem.case_type.replace("_", " ")}
            </Badge>
          )}
          {caseItem.priority && (
            <Badge variant={getPriorityColor(caseItem.priority)}>
              {caseItem.priority} priority
            </Badge>
          )}
          {caseItem.status && (
            <Badge variant="outline">{caseItem.status}</Badge>
          )}
        </div>
      </div>

      {caseItem.closed_on && (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Closed On</p>
            <p className="text-sm font-medium">
              {formatDateTime(caseItem.closed_on)}
            </p>
          </div>
        </div>
      )}

      {caseItem.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {caseItem.description}
          </p>
        </div>
      )}

      {caseItem.assigned_to && caseItem.assigned_to.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Assigned To</h4>
          <div className="space-y-2">
            {caseItem.assigned_to.map((user) => (
              <div key={user.id} className="text-sm">
                {user.email}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {caseItem.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(caseItem.created_at)}</span>
          </div>
        )}
        {caseItem.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(caseItem.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
