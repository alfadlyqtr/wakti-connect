
import React, { useState, useRef } from "react";
import { Send, Paperclip, Camera, Mic, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const [attachMode, setAttachMode] = useState<"none" | "file" | "camera" | "voice">("none");
  
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
  
  const toggleAttachMode = (mode: "file" | "camera" | "voice") => {
    setAttachMode(attachMode === mode ? "none" : mode);
  };
  
  const getAttachModeContent = () => {
    switch (attachMode) {
      case "file":
        return (
          <div className="p-3 bg-blue-50 rounded-lg mb-3 text-sm flex flex-col items-center">
            <p className="mb-2 text-center text-blue-700">Upload a file for the AI to analyze</p>
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 w-full text-center cursor-pointer hover:border-blue-400 transition-colors">
              <Paperclip className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="font-medium text-blue-700">Drop your file here or click to browse</p>
              <p className="text-xs text-blue-600 mt-1">Supports PDF, TXT, DOC, XLSX and more</p>
            </div>
          </div>
        );
      case "camera":
        return (
          <div className="p-3 bg-green-50 rounded-lg mb-3 text-sm flex flex-col items-center">
            <p className="mb-2 text-center text-green-700">Take a photo for the AI to analyze</p>
            <div className="border-2 border-dashed border-green-200 rounded-lg p-8 w-full text-center cursor-pointer hover:border-green-400 transition-colors">
              <Camera className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="font-medium text-green-700">Click to activate camera</p>
              <p className="text-xs text-green-600 mt-1">Take a picture and let AI analyze it</p>
            </div>
          </div>
        );
      case "voice":
        return (
          <div className="p-3 bg-purple-50 rounded-lg mb-3 text-sm flex flex-col items-center">
            <p className="mb-2 text-center text-purple-700">Record a voice message</p>
            <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 w-full text-center cursor-pointer hover:border-purple-400 transition-colors">
              <Mic className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="font-medium text-purple-700">Click to start recording</p>
              <p className="text-xs text-purple-600 mt-1">Speak clearly and I'll transcribe for you</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t bg-white p-3 shadow-sm"
    >
      {getAttachModeContent()}
      
      <div className="flex items-start gap-2">
        <div className="flex gap-1.5">
          <Button
            type="button"
            size="icon"
            variant={attachMode === "file" ? "default" : "outline"}
            className={`h-8 w-8 ${attachMode === "file" ? "bg-blue-500 hover:bg-blue-600" : "text-blue-500 hover:text-blue-600 hover:bg-blue-50"}`}
            onClick={() => toggleAttachMode("file")}
            title="Upload a file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={attachMode === "camera" ? "default" : "outline"}
            className={`h-8 w-8 ${attachMode === "camera" ? "bg-green-500 hover:bg-green-600" : "text-green-500 hover:text-green-600 hover:bg-green-50"}`}
            onClick={() => toggleAttachMode("camera")}
            title="Take a photo"
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={attachMode === "voice" ? "default" : "outline"}
            className={`h-8 w-8 ${attachMode === "voice" ? "bg-purple-500 hover:bg-purple-600" : "text-purple-500 hover:text-purple-600 hover:bg-purple-50"}`}
            onClick={() => toggleAttachMode("voice")}
            title="Record voice"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleChangeMessage}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none pr-12 py-2 min-h-[40px] max-h-[150px] rounded-lg bg-muted/30"
            disabled={isLoading || !canAccess}
          />
          {inputMessage && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-10 top-1.5 h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setInputMessage("")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1.5 h-7 w-7 bg-wakti-blue hover:bg-wakti-blue/80 disabled:bg-muted-foreground/20"
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
