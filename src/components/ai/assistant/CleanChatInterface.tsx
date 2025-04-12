
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AIMessage, AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, Mic, MicOff, Paperclip, Camera, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/components/ui/use-toast";
import { MessageAvatar } from "@/components/ai/message";
import { TaskConfirmationCard } from "@/components/ai/task/TaskConfirmationCard";
import { TaskFormData } from "@/types/task.types";
import { parseTaskFromMessage } from "@/hooks/ai/utils/taskParser";

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
  detectedTask?: TaskFormData | null;
  onConfirmTask?: (task: TaskFormData) => void;
  onCancelTask?: () => void;
  isCreatingTask?: boolean;
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
  detectedTask = null,
  onConfirmTask,
  onCancelTask,
  isCreatingTask = false,
}) => {
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [parsedMessage, setParsedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, detectedTask]);

  // Effect to attempt to parse a task from input for real-time preview
  useEffect(() => {
    if (inputMessage.length > 15) {
      const parsedTask = parseTaskFromMessage(inputMessage);
      if (parsedTask && parsedTask.title) {
        setParsedMessage(`Creating task: "${parsedTask.title}"`);
      } else {
        setParsedMessage(null);
      }
    } else {
      setParsedMessage(null);
    }
  }, [inputMessage]);

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
    <Card className="w-full overflow-hidden flex flex-col h-[650px] md:h-[700px] bg-gradient-to-b from-background to-background/95">
      <div className="flex-1 overflow-auto p-2 md:p-4 space-y-2 md:space-y-4">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4 md:py-8 px-2"
          >
            <div className={`h-14 w-14 rounded-full ${getRoleColor()} mx-auto mb-3 flex items-center justify-center overflow-hidden`}>
              <img 
                src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                alt="WAKTI AI" 
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2">
              Hello{userName ? ` ${userName}` : ''}, I'm your WAKTI AI Assistant
            </h2>
            <p className="text-muted-foreground mb-3 max-w-md mx-auto text-sm">
              I'm here to help you manage tasks, schedule events, and answer questions about your WAKTI experience.
            </p>
            
            {showSuggestions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto px-1">
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
                "flex items-start gap-2 mb-2.5 md:mb-3.5 mx-0.5",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              {msg.role === "assistant" ? (
                <Avatar className={`h-7 w-7 md:h-8 md:w-8 ${getRoleColor()} overflow-hidden shrink-0`}>
                  <img 
                    src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                    alt="WAKTI AI" 
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              ) : msg.role === "user" ? (
                <MessageAvatar isUser={true} className="h-7 w-7 md:h-8 md:w-8 shrink-0" />
              ) : (
                <Avatar className="h-7 w-7 md:h-8 md:w-8 bg-yellow-100 shrink-0">
                  <span className="text-xs font-medium">System</span>
                </Avatar>
              )}

              <div className={cn(
                "rounded-lg py-2 px-3 max-w-[90%] md:max-w-[80%]",
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
              className="flex items-start gap-2 mb-3 mx-0.5"
            >
              <Avatar className={`h-7 w-7 md:h-8 md:w-8 ${getRoleColor()} overflow-hidden shrink-0`}>
                <img 
                  src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                  alt="WAKTI AI" 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="bg-background rounded-lg py-2.5 px-3.5 border">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </motion.div>
          )}
          
          {detectedTask && onConfirmTask && onCancelTask && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto my-2 w-full max-w-md"
            >
              <TaskConfirmationCard 
                taskInfo={parseTaskFromMessage(detectedTask.title || '') || {
                  title: detectedTask.title || '',
                  description: detectedTask.description || '',
                  priority: detectedTask.priority || 'normal',
                  subtasks: detectedTask.subtasks?.map(s => s.content) || [],
                  dueDate: detectedTask.due_date,
                  dueTime: detectedTask.due_time,
                  hasTimeConstraint: !!detectedTask.due_date
                }}
                onConfirm={() => onConfirmTask(detectedTask)}
                onCancel={onCancelTask}
                isLoading={isCreatingTask}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 md:p-3 border-t relative">
        {parsedMessage && !detectedTask && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-background/80 backdrop-blur-sm border border-dashed px-2 py-1 rounded-full text-muted-foreground whitespace-nowrap">
            {parsedMessage}
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
          <div className="relative w-full">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className={cn(
                "py-6 text-sm md:text-base",
                isListening && "bg-rose-50 border-rose-200"
              )}
              disabled={isLoading || !canAccess || !!detectedTask}
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
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {onStartVoiceInput && onStopVoiceInput && (
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className={cn("h-10 w-10 rounded-full", isListening ? "text-rose-500 hover:text-rose-600" : "")}
                  onClick={handleVoiceToggle}
                  disabled={isLoading || !canAccess || !!detectedTask}
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
                    disabled={isLoading || !canAccess || !!detectedTask}
                    title="Attach file"
                    className="h-10 w-10 rounded-full"
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
                  disabled={isLoading || !canAccess || !!detectedTask}
                  title="Take photo"
                  className="h-10 w-10 rounded-full"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading || !canAccess || !!detectedTask}
              title="Send message"
              className="h-10 px-5 rounded-full"
            >
              <Send className="h-5 w-5 mr-1" />
              <span>Send</span>
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
