import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, File, Image, CheckCircle2 } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";

interface AIDocumentProcessorProps {
  onUseDocumentContent: (content: string) => void;
  selectedRole: AIAssistantRole;
  compact?: boolean;
}

export const AIDocumentProcessor: React.FC<AIDocumentProcessorProps> = ({
  onUseDocumentContent,
  selectedRole,
  compact = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingText, setProcessingText] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Simulate text extraction (in a real app, this would call a service)
      setTimeout(() => {
        setProcessingText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.");
      }, 1500);
      
      // Reset the input to allow uploading the same file again
      e.target.value = '';
    }
  };

  const handleUseText = () => {
    onUseDocumentContent(processingText);
  };

  const getRoleSpecificPrompt = () => {
    switch (selectedRole) {
      case "student":
        return "Upload documents, notes or images for analysis";
      case "employee":
        return "Upload work documents, reports or presentations";
      case "writer":
        return "Upload creative content, drafts or inspiration images";
      case "business_owner":
        return "Upload business documents, reports or marketing materials";
      default:
        return "Upload documents or images for AI analysis";
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div 
          className="border border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:bg-accent/30"
          onClick={handleFileUpload}
        >
          <Upload className="h-4 w-4 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">{getRoleSpecificPrompt()}</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,image/*"
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center text-xs p-1.5 bg-primary/5 rounded">
                {file.type.includes('image') ? (
                  <Image className="h-3 w-3 mr-1.5" />
                ) : (
                  <File className="h-3 w-3 mr-1.5" />
                )}
                <span className="truncate">{file.name}</span>
                <CheckCircle2 className="h-3 w-3 ml-1.5 text-green-500" />
              </div>
            ))}
            
            {processingText && (
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
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-accent/30 transition-colors"
        onClick={handleFileUpload}
      >
        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">Upload Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">{getRoleSpecificPrompt()}</p>
        <Button 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation();
            handleFileUpload();
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,image/*"
          multiple
        />
        <p className="text-xs text-muted-foreground mt-4">
          Supports PDF, Word, text files and images
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3 border rounded-lg p-4">
          <h4 className="font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-primary/5 rounded">
                {file.type.includes('image') ? (
                  <Image className="h-4 w-4 mr-2" />
                ) : (
                  <File className="h-4 w-4 mr-2" />
                )}
                <span className="truncate">{file.name}</span>
                <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
              </div>
            ))}
          </div>
          
          {processingText && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Extracted Content</h4>
              <div className="border rounded p-3 text-sm bg-primary/5 mb-3 max-h-40 overflow-y-auto">
                {processingText}
              </div>
              <Button onClick={handleUseText}>
                Use in Conversation
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
