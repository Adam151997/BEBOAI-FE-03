import type { Contact } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {contact.first_name} {contact.last_name}
        </h3>
      </div>

      <div className="space-y-3">
        {contact.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm hover:underline"
            >
              {contact.email}
            </a>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
              {contact.phone}
            </a>
          </div>
        )}

        {(contact.address_line ||
          contact.city ||
          contact.state ||
          contact.country) && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              {contact.address_line && <div>{contact.address_line}</div>}
              <div>
                {[contact.city, contact.state, contact.postcode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              {contact.country && <div>{contact.country}</div>}
            </div>
          </div>
        )}
      </div>

      {contact.description && (
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {contact.description}
          </p>
        </div>
      )}

      {contact.assigned_to && contact.assigned_to.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Assigned To</h4>
          <div className="space-y-2">
            {contact.assigned_to.map((user) => (
              <div key={typeof user === 'string' ? user : user.id} className="text-sm">
                {typeof user === 'string' ? user : user.email}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {contact.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDateTime(contact.created_at)}</span>
          </div>
        )}
        {contact.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(contact.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
