
import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Heading, Link, Image, Paperclip, Undo, Redo, Smile, MoreVertical
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { executeCommand, isCommandActive, handleFileUpload, isImageFile } from '../utils/editorUtils';

interface ToolbarProps {
  editorRef: React.RefObject<HTMLDivElement>;
  onAttachFile: (file: File) => void;
  onInsertImage: (url: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ editorRef, onAttachFile, onInsertImage }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      executeCommand(command, { value });
    }
  };

  const handleHeadingCommand = (level: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      executeCommand('formatBlock', { value: level });
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Simple validation
      new URL(linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`);
      
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      if (editorRef.current) {
        editorRef.current.focus();
        executeCommand('createLink', { url });
        setLinkUrl('');
        setShowLinkPopover(false);
        
        toast({
          title: "Link inserted",
          description: "Your link has been added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onAttachFile(file);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!isImageFile(file)) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      
      handleFileUpload(file, (url: string) => {
        onInsertImage(url);
        // Reset the input
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      });
    }
  };

  const isActive = (command: string, value?: string) => {
    return isCommandActive(command, value);
  };

  return (
    <div className="email-toolbar" role="toolbar" aria-label="Formatting options">
      <TooltipProvider delayDuration={300}>
        {/* Text formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${isActive('bold') ? 'active' : ''}`}
              onClick={() => handleCommand('bold')}
              aria-label="Bold"
            >
              <Bold size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${isActive('italic') ? 'active' : ''}`}
              onClick={() => handleCommand('italic')}
              aria-label="Italic"
            >
              <Italic size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${isActive('underline') ? 'active' : ''}`}
              onClick={() => handleCommand('underline')}
              aria-label="Underline"
            >
              <Underline size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Underline</TooltipContent>
        </Tooltip>

        <div className="toolbar-divider" />

        {/* Heading */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button className="toolbar-button" aria-label="Heading">
                  <Heading size={18} />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Heading</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-48 p-0" align="start">
            <div className="flex flex-col">
              {['Normal', 'H1', 'H2', 'H3', 'H4'].map((h) => (
                <button
                  key={h}
                  className={`p-2 text-left hover:bg-editor-hover transition-colors ${
                    isActive('formatBlock', h === 'Normal' ? 'p' : h.toLowerCase()) ? 'bg-editor-active' : ''
                  }`}
                  onClick={() => handleHeadingCommand(h === 'Normal' ? 'p' : h.toLowerCase())}
                >
                  {h}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="toolbar-divider" />

        {/* Alignment */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${isActive('justifyLeft') ? 'active' : ''}`}
              onClick={() => handleCommand('justifyLeft')}
              aria-label="Align Left"
            >
              <AlignLeft size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${isActive('justifyCenter') ? 'active' : ''}`}
              onClick={() => handleCommand('justifyCenter')}
              aria-label="Align Center"
            >
              <AlignCenter size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Center</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${isActive('justifyRight') ? 'active' : ''}`}
              onClick={() => handleCommand('justifyRight')}
              aria-label="Align Right"
            >
              <AlignRight size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Right</TooltipContent>
        </Tooltip>

        <div className="toolbar-divider" />

        {/* Link */}
        <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  className={`toolbar-button ${isActive('createLink') ? 'active' : ''}`}
                  aria-label="Insert Link"
                >
                  <Link size={18} />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Insert Link</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-2">
              <h3 className="font-medium">Insert Link</h3>
              <Input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleInsertLink}>Insert</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="toolbar-button"
              onClick={() => imageInputRef.current?.click()}
              aria-label="Insert Image"
            >
              <Image size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Insert Image</TooltipContent>
        </Tooltip>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Attach File */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="toolbar-button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach File"
            >
              <Paperclip size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Attach File</TooltipContent>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="toolbar-divider" />

        {/* History */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="toolbar-button"
              onClick={() => handleCommand('undo')}
              aria-label="Undo"
            >
              <Undo size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="toolbar-button"
              onClick={() => handleCommand('redo')}
              aria-label="Redo"
            >
              <Redo size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Redo</TooltipContent>
        </Tooltip>

        <div className="toolbar-divider" />

        {/* Emoji */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="toolbar-button"
              aria-label="Insert Emoji"
            >
              <Smile size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Insert Emoji</TooltipContent>
        </Tooltip>

        {/* More Options */}
        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="toolbar-button" aria-label="More Options">
                <MoreVertical size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">More Options</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;
