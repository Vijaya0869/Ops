import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  usePropertyDocuments,
  PropertyDocument,
} from "@/hooks/usePropertyDocuments";
import {
  Upload,
  Trash2,
  Download,
  FileText,
  Loader2,
  File,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PropertyDocumentUploadProps {
  propertyId: string | null;
}

export function PropertyDocumentUpload({
  propertyId,
}: PropertyDocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    documents,
    isLoading,
    isUploading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
  } = usePropertyDocuments(propertyId);

  useEffect(() => {
    if (propertyId) {
      fetchDocuments();
    }
  }, [propertyId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      await uploadDocument(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">Save the property first to add documents</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Documents</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 mb-2 opacity-50" />
          <p className="text-sm">No documents yet</p>
          <p className="text-xs">Upload contracts, inspections, etc.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              onDownload={() => downloadDocument(doc)}
              onDelete={() => deleteDocument(doc)}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DocumentRowProps {
  document: PropertyDocument;
  onDownload: () => void;
  onDelete: () => void;
  formatFileSize: (bytes: number | null) => string;
}

function DocumentRow({
  document,
  onDownload,
  onDelete,
  formatFileSize,
}: DocumentRowProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">
        <File className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{document.file_name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(document.file_size)} •{" "}
          {formatDistanceToNow(new Date(document.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDownload}
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
