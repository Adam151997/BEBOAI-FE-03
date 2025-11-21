import type { Team } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Users, Calendar } from "lucide-react";

interface TeamDetailsProps {
  team: Team;
  onClose: () => void;
}

export default function TeamDetails({ team }: TeamDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
        {team.users && team.users.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{team.users.length} member{team.users.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {team.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {team.description}
          </p>
        </div>
      )}

      {team.users && team.users.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <div className="space-y-2">
            {team.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded border">
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  {user.role && (
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {team.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(team.created_at)}</span>
          </div>
        )}
        {team.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(team.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
