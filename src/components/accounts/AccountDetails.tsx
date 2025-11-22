import type { Account } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Mail, Phone, Globe, MapPin, Calendar } from "lucide-react";

interface AccountDetailsProps {
  account: Account;
  onClose: () => void;
}

export default function AccountDetails({ account }: AccountDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">{account.name}</h3>
        {account.industry && (
          <Badge variant="outline">{account.industry}</Badge>
        )}
      </div>

      <div className="space-y-3">
        {account.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${account.email}`}
              className="text-sm hover:underline"
            >
              {account.email}
            </a>
          </div>
        )}

        {account.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${account.phone}`} className="text-sm hover:underline">
              {account.phone}
            </a>
          </div>
        )}

        {account.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={account.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              {account.website}
            </a>
          </div>
        )}

        {(account.billing_address_line ||
          account.billing_city ||
          account.billing_state ||
          account.billing_country) && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              {account.billing_address_line && (
                <div>{account.billing_address_line}</div>
              )}
              <div>
                {[
                  account.billing_city,
                  account.billing_state,
                  account.billing_postcode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              {account.billing_country && <div>{account.billing_country}</div>}
            </div>
          </div>
        )}
      </div>

      {account.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {account.description}
          </p>
        </div>
      )}

      {account.tags && account.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {account.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {account.assigned_to && account.assigned_to.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Assigned To</h4>
          <div className="space-y-2">
            {account.assigned_to.map((user) => (
              <div key={typeof user === 'string' ? user : user.id} className="text-sm">
                {typeof user === 'string' ? user : user.email}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {account.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(account.created_at)}</span>
          </div>
        )}
        {account.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(account.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
