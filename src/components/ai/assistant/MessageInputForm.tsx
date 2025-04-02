
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { processDocument } from '@/hooks/ai/utils/documentProcessor';

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
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading && canAccess) {
        handleSendMessage(e as unknown as React.FormEvent);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessingDoc(true);
    
    try {
      const document = await processDocument(file);
      
      if (document) {
        setActiveDoc(document);
        if (onDocumentProcessed) {
          onDocumentProcessed(document);
        }
        
        // Add context about the document to the message
        setInputMessage(prev => 
          prev.trim() ? 
          `${prev}\n\nI've uploaded a ${document.type} document called "${document.title}". Can you help me with it?` : 
          `I've uploaded a ${document.type} document called "${document.title}". Can you help me with it?`
        );
        
        toast({
          title: "Document Ready",
          description: `"${document.title}" is ready for analysis`,
        });
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Document Processing Failed",
        description: "There was a problem processing your document",
        variant: "destructive"
      });
    } finally {
      setIsProcessingDoc(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const clearActiveDocument = () => {
    setActiveDoc(null);
  };

  return (
    <form 
      onSubmit={handleSendMessage}
      className="border-t p-3 sm:p-4 flex flex-col"
    >
      {activeDoc && (
        <div className="mb-2 p-2 bg-muted rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm truncate">{activeDoc.title}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            type="button"
            onClick={clearActiveDocument}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none min-h-[70px]"
          disabled={isLoading || !canAccess}
        />
        
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={isLoading || !canAccess || isProcessingDoc}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9"
            title="Upload document"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isProcessingDoc}
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!inputMessage.trim() || isLoading || !canAccess}
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
