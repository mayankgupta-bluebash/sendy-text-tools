
interface CommandOptions {
  value?: string;
  url?: string;
}

// Execute document commands for the editor
export const executeCommand = (command: string, options?: CommandOptions): boolean => {
  try {
    if (command === 'createLink' && options?.url) {
      document.execCommand(command, false, options.url);
      return true;
    }
    
    if (command === 'formatBlock' && options?.value) {
      document.execCommand(command, false, options.value);
      return true;
    }
    
    document.execCommand(command, false, options?.value || '');
    return true;
  } catch (error) {
    console.error('Error executing command:', error);
    return false;
  }
};

// Check if command is currently active
export const isCommandActive = (command: string, value?: string): boolean => {
  if (command === 'formatBlock' && value) {
    return document.queryCommandValue(command) === value;
  }
  
  return document.queryCommandState(command);
};

// Handle file uploads
export const handleFileUpload = (file: File, onSuccess: (url: string) => void): void => {
  // In a real app, this would upload to a server
  // For now, create a temporary URL
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    if (result) {
      onSuccess(result);
    }
  };
  reader.readAsDataURL(file);
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// Check if a file is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};
