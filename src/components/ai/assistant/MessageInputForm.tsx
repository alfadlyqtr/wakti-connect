
import React, { useState, useRef, ChangeEvent } from 'react';
import { SendHorizontal, Paperclip, Bot, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { processDocument } from '@/hooks/ai/utils/aiUtils';

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  onDocumentProcessed?: (document: any) => void;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  onDocumentProcessed
}) => {
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const handleUploadClick = () => {
    if (!canAccess) {
      toast({
        title: "Feature Unavailable",
        description: "Please upgrade your plan to upload documents.",
        variant: "destructive",
      });
      return;
    }
    
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Process the document
    try {
      setIsPending(true);
      const processedDoc = await processDocument(file);
      
      // Add a note about the document to the message input
      setInputMessage(prev => `I've uploaded a document named "${file.name}". ${prev}`);
      
      // Notify parent component about the processed document
      if (onDocumentProcessed && processedDoc) {
        onDocumentProcessed(processedDoc);
      }
      
      toast({
        title: "Document Uploaded",
        description: `"${file.name}" has been processed and added to the conversation.`,
      });
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <form onSubmit={handleSendMessage} className="border-t p-3 sm:p-4">
      <div className="relative flex items-end">
        <Textarea
          placeholder={canAccess ? "Type your message here..." : "Upgrade to use AI assistant"}
          className="min-h-10 max-h-40 resize-none pr-14 py-2.5 rounded-lg"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={!canAccess || isLoading || isPending}
        />
        <div className="absolute right-1 bottom-1 flex">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canAccess || isLoading || isPending}
            onClick={handleUploadClick}
            title="Upload document"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="icon"
            className="h-8 w-8 bg-wakti-blue text-white hover:bg-wakti-blue/80"
            disabled={!canAccess || !inputMessage.trim() || isLoading || isPending}
            title="Send message"
          >
            {isLoading ? (
              <Bot className="h-4 w-4 animate-pulse" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {isPending && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 animate-pulse" />
          <span>Processing document...</span>
        </div>
      )}
    </form>
  );
};
