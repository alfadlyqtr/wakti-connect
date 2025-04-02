
import React, { useState } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIDocumentProcessorProps {
  onDocumentProcessed: (documentContent: string) => void;
}

export const AIDocumentProcessor: React.FC<AIDocumentProcessorProps> = ({ onDocumentProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, text file, or image (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const processDocument = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // For now, we'll just read text files directly
      // In a real implementation, we'd send the file to an edge function for processing
      if (file.type === 'text/plain') {
        const text = await file.text();
        
        // Store the processed document
        const { data, error } = await supabase
          .from('ai_processed_documents')
          .insert({
            document_name: file.name,
            document_type: file.type,
            content: text,
            summary: text.substring(0, 150) + '...' // Simple summary for now
          })
          .select();
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Call the callback with the extracted text
        onDocumentProcessed(text);
        
        toast({
          title: "Document processed",
          description: "The text has been extracted and is ready to use",
        });
        
        // Reset the file input
        setFile(null);
      } else {
        // For other file types, we'd need to implement specific processing logic
        // This would typically involve an edge function with OCR for images and PDFs
        toast({
          title: "Processing not yet implemented",
          description: "Full document processing will be available soon",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <File className="h-5 w-5" />
          Document Processing
        </CardTitle>
        <CardDescription>
          Upload a document to extract text for the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="document-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, TXT, or Images (PNG, JPG)
              </p>
            </div>
            <Input
              id="document-upload"
              type="file"
              accept=".pdf,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </label>
        </div>
        
        {file && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-gray-500" />
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button
              onClick={() => setFile(null)}
              variant="ghost"
              size="sm"
              disabled={isProcessing}
            >
              Remove
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={processDocument} 
          disabled={!file || isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
