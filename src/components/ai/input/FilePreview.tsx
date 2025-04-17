
import React from 'react';
import { X, FileText, Image, Film, FileCode, FileSpreadsheet, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface FilePreviewProps {
  file: File;
  previewUrl?: string | null;
  onRemove: () => void;
  isProcessing?: boolean;
  processingStatus?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  previewUrl,
  onRemove,
  isProcessing = false,
  processingStatus
}) => {
  const getFileTypeIcon = () => {
    const type = file.type.split('/')[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (type === 'image') return <Image className="h-6 w-6 text-blue-500" />;
    if (type === 'video') return <Film className="h-6 w-6 text-purple-500" />;
    if (type === 'text') return <FileText className="h-6 w-6 text-orange-500" />;
    
    // Handle specific extensions
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
        return <FileCode className="h-6 w-6 text-yellow-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const isImage = file.type.startsWith('image/');
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="relative flex items-center gap-3 p-3 border rounded-lg bg-background/50 backdrop-blur-sm"
      >
        {isImage && previewUrl ? (
          <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border">
            <img 
              src={previewUrl} 
              alt={file.name} 
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 flex items-center justify-center flex-shrink-0 rounded-md bg-muted">
            {getFileTypeIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB
          </p>
          {isProcessing && processingStatus && (
            <p className="text-xs text-primary flex items-center gap-1 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {processingStatus}
            </p>
          )}
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onRemove}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};
