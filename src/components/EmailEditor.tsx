
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from "framer-motion";
import { executeCommand, isImageFile, handleFileUpload } from '../utils/editorUtils';
import { v4 as uuidv4 } from 'uuid';
import Toolbar from './Toolbar';
import FileAttachment, { Attachment } from './FileAttachment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface EmailEditorProps {
  onClose?: () => void;
  onSend?: (content: { subject: string; body: string; attachments: Attachment[] }) => void;
  initialSubject?: string;
  initialContent?: string;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ 
  onClose, 
  onSend,
  initialSubject = '',
  initialContent = '' 
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleAttachFile = (file: File) => {
    if (attachments.length >= 5) {
      toast({
        title: "Maximum attachments reached",
        description: "You can only attach up to 5 files",
        variant: "destructive"
      });
      return;
    }

    const id = uuidv4();
    
    handleFileUpload(file, (url: string) => {
      const newAttachment: Attachment = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        url
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      
      toast({
        title: "File attached",
        description: `${file.name} has been attached successfully`,
      });
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handleInsertImage = (url: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      executeCommand('insertImage', { value: url });
    }
  };

  const handleSend = () => {
    if (!subject.trim()) {
      toast({
        title: "Subject is required",
        description: "Please enter a subject for your email",
        variant: "destructive"
      });
      return;
    }
    
    if (editorRef.current) {
      const body = editorRef.current.innerHTML;
      if (!body.trim() || body === '<br>') {
        toast({
          title: "Email body is empty",
          description: "Please enter some content for your email",
          variant: "destructive"
        });
        return;
      }
      
      if (onSend) {
        onSend({
          subject,
          body,
          attachments
        });
      }
      
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully",
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file && isImageFile(file)) {
            e.preventDefault();
            handleFileUpload(file, (url: string) => {
              handleInsertImage(url);
            });
            return;
          }
        }
      }
    }
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={animationVariants}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-blue-600">Email Preview</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-editor-hover transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center">
          <label htmlFor="subject" className="text-lg font-medium w-20">Subject</label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg"
          />
        </div>
      </div>
      
      <div className="email-editor">
        <Toolbar 
          editorRef={editorRef}
          onAttachFile={handleAttachFile}
          onInsertImage={handleInsertImage}
        />
        
        <div
          ref={editorRef}
          className="email-editor-content"
          contentEditable
          suppressContentEditableWarning
          onPaste={handlePaste}
          aria-label="Email content"
          dangerouslySetInnerHTML={{ __html: initialContent }}
        />
        
        <FileAttachment 
          attachments={attachments}
          onRemove={handleRemoveAttachment}
        />
      </div>
      
      <div className="p-4 flex justify-end">
        <Button 
          onClick={handleSend}
          className="transition-all duration-300 transform hover:scale-105"
        >
          Send Email
        </Button>
      </div>
    </motion.div>
  );
};

export default EmailEditor;
