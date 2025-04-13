import React, { useRef, useEffect, useState } from "react";
import { SendHorizontal, Loader2, Mic, MicOff, ImagePlus, Volume2, Camera } from "lucide-react";
import { AIMessage, AIAssistantRole } from "@/types/ai-assistant.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIMessageBubble } from "./AIMessageBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { parseTaskFromMessage } from "@/hooks/ai/utils/taskParser";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser.types";
import { cn } from "@/lib/utils";
import { TypographyP } from "@/components/ui/typography";
import { TaskConfirmationCard } from "../task/TaskConfirmationCard";

const AudioLevelIndicator = ({ level }: { level: number }) => {
  const bars = 5;
  const activeCount = Math.min(bars, Math.ceil(level * bars));
  
  return (
    <div className="flex gap-0.5 items-center h-3">
      {Array.from({ length: bars }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "w-0.5 transition-all duration-75 rounded-full", 
            i < activeCount ? "bg-green-500" : "bg-muted",
            { "h-1": i === 0 || i === 4 },
            { "h-1.5": i === 1 || i === 3 },
            { "h-2": i === 2 }
          )}
        />
      ))}
    </div>
  );
};

interface CleanChatInterfaceProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  selectedRole: AIAssistantRole;
  userName?: string;
  canAccess: boolean;
  detectedTask?: ParsedTaskInfo | null;
  onConfirmTask?: () => void;
  onCancelTask?: () => void;
  pendingTaskConfirmation?: boolean;
  isCreatingTask?: boolean;
  onFileUpload?: (file: File) => void;
  onStartVoiceInput?: () => void;
  onStopVoiceInput?: () => void;
  onConfirmTranscript?: () => void;
  isListening?: boolean;
  audioLevel?: number;
  processingVoice?: boolean;
  temporaryTranscript?: string | null;
  showSuggestions?: boolean;
  onCameraCapture?: () => void;
}

export const CleanChatInterface: React.FC<CleanChatInterfaceProps> = ({
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  selectedRole,
  userName,
  canAccess,
  detectedTask,
  onConfirmTask,
  onCancelTask,
  pendingTaskConfirmation = false,
  isCreatingTask = false,
  onFileUpload,
  onStartVoiceInput,
  onStopVoiceInput,
  onConfirmTranscript,
  isListening = false,
  audioLevel = 0,
  processingVoice = false,
  temporaryTranscript = null,
  showSuggestions = true,
  onCameraCapture
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [useTextarea, setUseTextarea] = useState(false);
  
  const getPlaceholderText = () => {
    switch (selectedRole) {
      case "student":
        return "Need help with your homework or studies?";
      case "employee":
      case "writer":
        return "Let's brainstorm or create something fun...";
      case "business_owner":
        return "Need help running your business account?";
      default:
        return "Ask me anything...";
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, temporaryTranscript, pendingTaskConfirmation]);

  useEffect(() => {
    if (inputMessage.length > 100 && !useTextarea) {
      setUseTextarea(true);
    } else if (inputMessage.length === 0 && useTextarea) {
      setUseTextarea(false);
    }
  }, [inputMessage, useTextarea]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    if (e.target.value) e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  const isInputEmpty = inputMessage.trim() === '';

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] sm:h-[600px] max-h-[700px] bg-card rounded-md border shadow-sm">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-2 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">How can I help today?</h3>
                <p className="text-sm max-w-md">
                  I'm your AI assistant in {selectedRole === "business_owner" ? "business" : 
                    selectedRole === "student" ? "student" : 
                    (selectedRole === "employee" || selectedRole === "writer") ? "creative" : "general"} mode
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <AIMessageBubble 
                key={message.id || index} 
                message={message} 
                userName={userName || "You"}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg rounded-tl-none bg-muted p-3 max-w-[80%]">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          )}
          
          {isListening && (
            <div className="flex items-start gap-3 animate-in fade-in-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg rounded-tl-none bg-muted p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs flex gap-1 items-center">
                    <Mic className="h-3 w-3" /> Listening
                  </Badge>
                  <AudioLevelIndicator level={audioLevel} />
                </div>
                {temporaryTranscript ? (
                  <>
                    <p className="text-sm text-muted-foreground pb-1">{temporaryTranscript}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-6 text-xs"
                        onClick={onConfirmTranscript}
                      >
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs"
                        onClick={onStopVoiceInput}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Speak now...</p>
                )}
              </div>
            </div>
          )}
          
          {!isListening && processingVoice && (
            <div className="flex items-start gap-3 animate-in fade-in-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg rounded-tl-none bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Processing audio...</span>
                </div>
              </div>
            </div>
          )}
          
          {pendingTaskConfirmation && detectedTask && (
            <div className="py-2">
              <TaskConfirmationCard
                taskInfo={detectedTask}
                onConfirm={onConfirmTask || (() => {})}
                onCancel={onCancelTask || (() => {})}
                isLoading={isCreatingTask}
              />
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage}>
          <div className="relative">
            {useTextarea ? (
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={getPlaceholderText()}
                className="pr-24 resize-none min-h-[80px]"
                disabled={isLoading || !canAccess || isListening || pendingTaskConfirmation}
                onFocus={() => setShowControls(true)}
                onBlur={() => setTimeout(() => setShowControls(false), 200)}
              />
            ) : (
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={getPlaceholderText()}
                className="pr-24"
                disabled={isLoading || !canAccess || isListening || pendingTaskConfirmation}
                onFocus={() => setShowControls(true)}
                onBlur={() => setTimeout(() => setShowControls(false), 200)}
              />
            )}
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {(showControls || !isInputEmpty) && (
                <>
                  {onCameraCapture && (
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={onCameraCapture}
                      disabled={isLoading || !canAccess || isListening || pendingTaskConfirmation}
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Take Photo</span>
                    </Button>
                  )}
                  
                  {onFileUpload && (
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={triggerFileInput}
                      disabled={isLoading || !canAccess || isListening || pendingTaskConfirmation}
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span className="sr-only">Upload File</span>
                    </Button>
                  )}
                  
                  {onStartVoiceInput && onStopVoiceInput && (
                    <Button 
                      type="button" 
                      size="icon" 
                      variant={isListening ? "secondary" : "ghost"}
                      className={cn(
                        "h-8 w-8",
                        isListening ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={isListening ? onStopVoiceInput : onStartVoiceInput}
                      disabled={isLoading || !canAccess || pendingTaskConfirmation}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      <span className="sr-only">{isListening ? "Stop Recording" : "Voice Input"}</span>
                    </Button>
                  )}
                </>
              )}
              
              <Button 
                type="submit" 
                size="icon" 
                disabled={isInputEmpty || isLoading || !canAccess || isListening || pendingTaskConfirmation}
                className="h-8 w-8"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
                <span className="sr-only">Send Message</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
