import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AIDocumentProcessorProps {
  onDocumentProcessed?: (content: string) => void;
}

export const AIDocumentProcessor: React.FC<AIDocumentProcessorProps> = ({ 
  onDocumentProcessed 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a document smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    // Allowed file types
    const allowedTypes = [
      'application/pdf', 
      'text/plain', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, TXT, or DOC/DOCX file",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Read file as text (for simplicity, this would be more complex for PDFs/DOCs)
      const content = await readFileContent(file);
      
      // Store document in the database
      if (user) {
        const { error } = await supabase
          .from('ai_processed_documents')
          .insert({
            user_id: user.id,
            document_name: file.name,
            document_type: file.type,
            content: content,
            // For simplicity, we're not doing actual AI processing here
            summary: content.length > 500 ? content.substring(0, 500) + "..." : content
          });
        
        if (error) throw error;
      }
      
      // Notify parent component
      if (onDocumentProcessed) {
        onDocumentProcessed(content);
      }
      
      toast({
        title: "Document processed",
        description: "Your document has been processed successfully",
      });
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const readFileContent = async (file: File): Promise<string> => {
    // Simple file reader for text files
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("File reading error"));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For non-text files, we'd need more complex processing
        // For now, let's just return the filename as placeholder
        resolve(`[Content of ${file.name}] - This is placeholder text for ${file.type} files`);
      }
    });
  };
  
  return (
    <Card>
      <CardContent className="flex flex-col space-y-4">
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          Upload a .pdf, .txt, .doc, or .docx file (max 10MB)
        </p>
      </CardContent>
    </Card>
  );
};
