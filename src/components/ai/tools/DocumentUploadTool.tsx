
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, File, CheckCircle2 } from 'lucide-react';
import { AIToolCard } from './AIToolCard';

interface DocumentUploadToolProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
  compact?: boolean;
}

export const DocumentUploadTool: React.FC<DocumentUploadToolProps> = ({
  canAccess,
  onUseDocumentContent,
  compact = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!canAccess) {
    return null;
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Simulate text extraction (in a real app, this would call a backend service)
      setTimeout(() => {
        setExtractedText("Document text extraction complete. This is sample extracted text content that would normally come from processing the uploaded document using OCR or other document parsing technologies.");
      }, 1000);
      
      // Reset the input to allow uploading the same file again
      e.target.value = '';
    }
  };

  const handleUseText = () => {
    onUseDocumentContent(extractedText);
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm mb-1">
          <FileText className="h-4 w-4 mr-1.5" />
          <span className="font-medium">Document Analysis</span>
        </div>
        <div 
          className="border border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:bg-accent/30"
          onClick={handleFileUpload}
        >
          <Upload className="h-4 w-4 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Upload documents for text extraction</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center text-xs p-1.5 bg-primary/5 rounded">
                <File className="h-3 w-3 mr-1.5" />
                <span className="truncate">{file.name}</span>
                <CheckCircle2 className="h-3 w-3 ml-1.5 text-green-500" />
              </div>
            ))}
            
            {extractedText && (
              <Button 
                size="sm" 
                className="w-full mt-2 text-xs h-7" 
                onClick={handleUseText}
              >
                Use in chat
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <AIToolCard
      icon={FileText}
      title="Document Upload & Text Extraction"
      description="Upload documents and extract text for AI analysis"
      iconColor="text-blue-500"
    >
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-accent/30 transition-colors"
          onClick={handleFileUpload}
        >
          <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-base font-medium mb-1">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mb-3">Upload files for text extraction</p>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              handleFileUpload();
            }}
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </Button>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
          />
          <p className="text-xs text-muted-foreground mt-3">
            Supports PDF, Word, and text files
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-3 border rounded-lg p-4">
            <h4 className="font-medium">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center p-2 bg-primary/5 rounded">
                  <File className="h-4 w-4 mr-2" />
                  <span className="truncate">{file.name}</span>
                  <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                </div>
              ))}
            </div>
            
            {extractedText && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Extracted Text</h4>
                <div className="border rounded p-3 text-sm bg-primary/5 mb-3 max-h-40 overflow-y-auto">
                  {extractedText}
                </div>
                <Button onClick={handleUseText}>
                  Use in Conversation
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AIToolCard>
  );
};
