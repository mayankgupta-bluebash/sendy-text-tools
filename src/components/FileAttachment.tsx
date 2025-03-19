
import React from 'react';
import { Paperclip, X, FileText } from 'lucide-react';
import { formatFileSize, getFileExtension } from '../utils/editorUtils';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileAttachmentProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-editor-border">
      <div className="flex flex-wrap gap-2 animate-fade-in">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="attachment-chip group">
            <div className="flex items-center">
              <FileText size={16} className="mr-1" />
              <span className="truncate max-w-[120px]">{attachment.name}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({formatFileSize(attachment.size)})
              </span>
              <button
                onClick={() => onRemove(attachment.id)}
                className="ml-1 p-1 rounded-full hover:bg-editor-hover text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove attachment"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileAttachment;
