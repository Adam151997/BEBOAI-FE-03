import type { Lead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Mail, Phone, Building2, Globe, MapPin, Calendar } from "lucide-react";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
}

export default function LeadDetails({ lead }: LeadDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {lead.title && `${lead.title}. `}
          {lead.first_name} {lead.last_name}
        </h3>
        {lead.company && (
          <p className="text-sm text-muted-foreground">{lead.company}</p>
        )}
      </div>

      {(lead.status || lead.source) && (
        <div className="flex flex-wrap gap-2">
          {lead.status && <Badge variant="outline">{lead.status}</Badge>}
          {lead.source && <Badge variant="secondary">{lead.source}</Badge>}
        </div>
      )}

      <div className="space-y-3">
        {lead.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${lead.email}`}
              className="text-sm hover:underline"
            >
              {lead.email}
            </a>
          </div>
        )}

        {lead.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${lead.phone}`} className="text-sm hover:underline">
              {lead.phone}
            </a>
          </div>
        )}

        {lead.company && (
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{lead.company}</span>
          </div>
        )}

        {lead.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              {lead.website}
            </a>
          </div>
        )}

        {(lead.address_line || lead.city || lead.state || lead.country) && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              {lead.address_line && <div>{lead.address_line}</div>}
              <div>
                {[lead.city, lead.state, lead.postcode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              {lead.country && <div>{lead.country}</div>}
            </div>
          </div>
        )}
      </div>

      {lead.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {lead.description}
          </p>
        </div>
      )}

      {lead.tags && lead.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {lead.assigned_to && lead.assigned_to.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Assigned To</h4>
          <div className="space-y-2">
            {lead.assigned_to.map((user) => (
              <div key={typeof user === 'string' ? user : user.id} className="text-sm">
                {typeof user === 'string' ? user : user.email}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {lead.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(lead.created_at)}</span>
          </div>
        )}
        {lead.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(lead.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
