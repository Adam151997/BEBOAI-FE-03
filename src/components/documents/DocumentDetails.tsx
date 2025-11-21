import type { Document } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Calendar, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentDetailsProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentDetails({ document }: DocumentDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">{document.title || "Untitled Document"}</h3>
        </div>
      </div>

      {document.document_file && (
        <div>
          <h4 className="text-sm font-medium mb-2">File</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(document.document_file, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 break-all">
            {document.document_file}
          </p>
        </div>
      )}

      <div className="pt-4 border-t space-y-2">
        {document.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Uploaded: {formatDateTime(document.created_at)}</span>
          </div>
        )}
        {document.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Updated: {formatDateTime(document.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
