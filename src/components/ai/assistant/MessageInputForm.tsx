
import React, { useState, useRef } from "react";
import { Send, Paperclip, Camera, Mic, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading && canAccess) {
        handleSendMessage(e);
      }
    }
  };

  const autoGrowTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    autoGrowTextarea();
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t p-3 shadow-sm bg-white"
    >
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none pr-24 py-2 min-h-[40px] max-h-[150px] rounded-lg bg-muted/30"
          disabled={isLoading || !canAccess}
        />
        
        <div className="absolute right-2 top-1.5 flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
                  disabled={isLoading || !canAccess}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:bg-green-50 hover:text-green-600"
                  disabled={isLoading || !canAccess}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Take photo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:bg-purple-50 hover:text-purple-600"
                  disabled={isLoading || !canAccess}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice recording</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {inputMessage && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setInputMessage("")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            size="icon"
            className="h-7 w-7 bg-wakti-blue hover:bg-wakti-blue/80 disabled:bg-muted-foreground/20"
            disabled={!inputMessage.trim() || isLoading || !canAccess}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-center text-muted-foreground">
        WAKTI AI can make mistakes. Consider checking important information.
      </div>
    </form>
  );
};
