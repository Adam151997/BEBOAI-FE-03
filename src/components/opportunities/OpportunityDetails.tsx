import type { Opportunity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

interface OpportunityDetailsProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export default function OpportunityDetails({ opportunity }: OpportunityDetailsProps) {
  const getStageColor = (stage: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
      prospecting: "outline",
      qualification: "secondary",
      "needs-analysis": "secondary",
      proposal: "default",
      negotiation: "default",
      "closed-won": "success",
      "closed-lost": "destructive",
    };
    return colors[stage] || "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{opportunity.name}</h3>
        <Badge variant={getStageColor(opportunity.stage || "")}>{opportunity.stage || "N/A"}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {opportunity.amount && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Amount</span>
            </div>
            <p className="text-lg font-semibold">
              ${opportunity.amount.toLocaleString()}
            </p>
          </div>
        )}

        {opportunity.probability !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Probability</span>
            </div>
            <p className="text-lg font-semibold">{opportunity.probability}%</p>
          </div>
        )}
      </div>

      {opportunity.close_date && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Close Date</p>
          <p className="text-sm">
            {new Date(opportunity.close_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {opportunity.lead_source && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Lead Source</p>
          <p className="text-sm">{opportunity.lead_source}</p>
        </div>
      )}

      {opportunity.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {opportunity.description}
          </p>
        </div>
      )}

      {opportunity.tags && opportunity.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {opportunity.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(opportunity.created_at)}</span>
          </div>
        )}
        {opportunity.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(opportunity.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
