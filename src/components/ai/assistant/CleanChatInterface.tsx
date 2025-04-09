
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AIMessage, AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Bot, Send, Mic, MicOff, Paperclip, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/components/ui/use-toast";
import { MessageAvatar } from "@/components/ai/message";

interface CleanChatInterfaceProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  selectedRole: AIAssistantRole;
  userName?: string;
  canAccess: boolean;
  onFileUpload?: (file: File) => void;
  onCameraCapture?: () => void;
  onStartVoiceInput?: () => void;
  onStopVoiceInput?: () => void;
  isListening?: boolean;
  showSuggestions?: boolean;
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
  onFileUpload,
  onCameraCapture,
  onStartVoiceInput,
  onStopVoiceInput,
  isListening = false,
  showSuggestions = true,
}) => {
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onFileUpload) return;
    
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    onFileUpload(file);
    e.target.value = ''; // Reset the file input
  };

  const handleVoiceToggle = () => {
    if (isListening && onStopVoiceInput) {
      onStopVoiceInput();
    } else if (!isListening && onStartVoiceInput) {
      onStartVoiceInput();
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getRoleColor = () => {
    switch (selectedRole) {
      case "student": return "bg-blue-500";
      case "employee": 
      case "writer": return "bg-purple-500";
      case "business_owner": return "bg-amber-500";
      default: return "bg-wakti-blue";
    }
  };

  const getSuggestedPrompts = () => {
    return RoleContexts[selectedRole]?.suggestedPrompts || [];
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col h-[700px]">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <div className={`h-16 w-16 rounded-full ${getRoleColor()} mx-auto mb-4 flex items-center justify-center overflow-hidden`}>
              <img 
                src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                alt="WAKTI AI" 
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Hello{userName ? ` ${userName}` : ''}, I'm your WAKTI AI Assistant
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I'm here to help you with your tasks, answer questions, and provide assistance as needed.
            </p>
            
            {showSuggestions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {getSuggestedPrompts().map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-sm h-auto py-2 justify-start text-left"
                    onClick={() => setInputMessage(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-start gap-3 mb-4",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              {msg.role === "assistant" ? (
                <Avatar className={`h-8 w-8 ${getRoleColor()} overflow-hidden`}>
                  <img 
                    src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                    alt="WAKTI AI" 
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              ) : msg.role === "user" ? (
                <MessageAvatar isUser={true} />
              ) : (
                <Avatar className="h-8 w-8 bg-yellow-100">
                  <span className="text-xs font-medium">System</span>
                </Avatar>
              )}

              <div className={cn(
                "rounded-lg py-2 px-3 max-w-[80%]",
                msg.role === "assistant" ? "bg-background border" : 
                msg.role === "user" ? "bg-primary text-primary-foreground" : 
                "bg-orange-50 text-orange-800 border border-orange-100"
              )}>
                <div className="prose dark:prose-invert max-w-none text-sm prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 mb-4"
            >
              <Avatar className={`h-8 w-8 ${getRoleColor()} overflow-hidden`}>
                <img 
                  src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                  alt="WAKTI AI" 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="bg-background rounded-lg py-3 px-4 border">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className={cn(
                "pr-10",
                isListening && "bg-rose-50 border-rose-200"
              )}
              disabled={isLoading || !canAccess}
            />
            {isListening && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              </span>
            )}
          </div>
          
          {onStartVoiceInput && onStopVoiceInput && (
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className={isListening ? "text-rose-500 hover:text-rose-600" : ""}
              onClick={handleVoiceToggle}
              disabled={isLoading || !canAccess}
              title={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          
          {onFileUpload && (
            <>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                onClick={handleFileUploadClick}
                disabled={isLoading || !canAccess}
                title="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png"
              />
            </>
          )}
          
          {onCameraCapture && (
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={onCameraCapture}
              disabled={isLoading || !canAccess}
              title="Take photo"
            >
              <Camera className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputMessage.trim() || isLoading || !canAccess}
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
