
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload, Trash2, FileText, FileSearch } from 'lucide-react';
import { getUserDocuments, deleteDocument, processDocument } from '@/hooks/ai/utils/documentProcessor';

export const AIDocumentManager: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    loadDocuments();
  }, [user]);
  
  const loadDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const docs = await getUserDocuments(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        title: "Error",
        description: "Failed to load your documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    setIsUploading(true);
    try {
      const processedDoc = await processDocument(selectedFile);
      
      if (processedDoc) {
        // Add the document to the display list temporarily until refresh
        setDocuments(prev => [processedDoc, ...prev]);
        
        toast({
          title: "Document Uploaded",
          description: `Successfully uploaded ${selectedFile.name}`
        });
        
        // Reset the file input
        setSelectedFile(null);
        
        // Reload the documents from server to get the saved version
        loadDocuments();
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: "Document Deleted",
        description: "The document has been removed"
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting the document",
        variant: "destructive"
      });
    }
  };
  
  const truncateContent = (content: string, maxLength = 100) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="h-5 w-5" />
          Document Intelligence
        </CardTitle>
        <CardDescription>
          Upload documents for the AI to analyze and reference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            size="sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Your Documents</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No documents yet. Upload something for the AI to analyze.
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3 border rounded-md flex justify-between items-start"
                >
                  <div className="flex gap-2">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {truncateContent(doc.content)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
