
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAssistantUpgradeCard } from "./AIAssistantUpgradeCard";
import { AIDocumentProcessor } from "./assistant/AIDocumentProcessor";
import { supabase } from "@/integrations/supabase/client";
import { AIProcessedDocument } from "@/types/ai-assistant.types";
import { File, Trash, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fromTable } from "@/integrations/supabase/helper";

interface AIAssistantDocumentsCardProps {
  canAccess: boolean;
  onUseDocumentContent?: (content: string) => void;
}

export function AIAssistantDocumentsCard({ canAccess, onUseDocumentContent }: AIAssistantDocumentsCardProps) {
  const [documents, setDocuments] = useState<AIProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await fromTable<AIProcessedDocument>('ai_processed_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load processed documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) {
      fetchDocuments();
    }
  }, [canAccess]);

  const handleDocumentProcessed = (documentContent: string) => {
    // Refresh the document list
    fetchDocuments();
    
    // If callback provided, use it
    if (onUseDocumentContent) {
      onUseDocumentContent(documentContent);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await fromTable('ai_processed_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update the local state
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Document deleted",
        description: "The document has been removed successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete the document",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Processing</CardTitle>
        <CardDescription>Upload and process documents for AI analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {canAccess ? (
          <>
            <AIDocumentProcessor onDocumentProcessed={handleDocumentProcessed} />
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Processed Documents</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-wakti-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No documents processed yet</p>
                  <p className="text-sm mt-1">Upload a document to get started</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg hover:border-wakti-blue/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <File className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium truncate max-w-[240px]">{doc.document_name}</h4>
                            <div className="flex gap-4 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{doc.document_type.split('/')[1]}</span>
                            </div>
                            {doc.summary && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{doc.summary}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {onUseDocumentContent && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onUseDocumentContent(doc.content)}
                              title="Use in chat"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDocument(doc.id)}
                            className="text-red-500 hover:bg-red-50"
                            title="Delete document"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <AIAssistantUpgradeCard />
        )}
      </CardContent>
    </Card>
  );
}
