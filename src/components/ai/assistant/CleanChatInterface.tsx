
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AIMessage, AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageAvatar } from "@/components/ai/message";
import { TaskConfirmationCard } from "@/components/ai/task/TaskConfirmationCard";
import { TaskFormData } from "@/types/task.types";
import { parseTaskFromMessage } from "@/hooks/ai/utils/taskParser";
import { ChatMessageInput } from "./ChatMessageInput";

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
  onConfirmTranscript?: () => void;
  isListening?: boolean;
  audioLevel?: number;
  processingVoice?: boolean;
  temporaryTranscript?: string;
  showSuggestions?: boolean;
  detectedTask?: TaskFormData | null;
  onConfirmTask?: (task: TaskFormData) => void;
  onCancelTask?: () => void;
  isCreatingTask?: boolean;
  pendingTaskConfirmation?: boolean;
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
  onConfirmTranscript,
  isListening = false,
  audioLevel = 0,
  processingVoice = false,
  temporaryTranscript,
  showSuggestions = true,
  detectedTask = null,
  onConfirmTask,
  onCancelTask,
  isCreatingTask = false,
  pendingTaskConfirmation = false,
}) => {
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [parsedMessage, setParsedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, detectedTask]);

  useEffect(() => {
    if (inputMessage.length > 15 && !pendingTaskConfirmation) {
      const parsedTask = parseTaskFromMessage(inputMessage);
      if (parsedTask && parsedTask.title) {
        let previewText = `Creating task: "${parsedTask.title}"`;
        if (parsedTask.location) {
          previewText += ` at ${parsedTask.location}`;
        }
        setParsedMessage(previewText);
      } else {
        setParsedMessage(null);
      }
    } else {
      setParsedMessage(null);
    }
  }, [inputMessage, pendingTaskConfirmation]);

  useEffect(() => {
    if (pendingTaskConfirmation) {
      setParsedMessage("Quick confirmation: Type 'Go', 'Yes', 'Do it', or 'Sure'");
    }
  }, [pendingTaskConfirmation]);

  const getRoleColor = () => {
    switch (selectedRole) {
      case "student": return "bg-blue-500";
      case "employee": 
      case "writer": return "bg-purple-500";
      case "business_owner": return "bg-amber-500";
      default: return "bg-wakti-blue";
    }
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
                {RoleContexts[selectedRole]?.suggestedPrompts.map((prompt, index) => (
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
          
          {detectedTask && onConfirmTask && onCancelTask && !pendingTaskConfirmation && (
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
                  due_date: detectedTask.due_date,
                  dueTime: detectedTask.due_time,
                  location: detectedTask.location,
                  hasTimeConstraint: !!detectedTask.due_date,
                  needsReview: false
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
      
      <div className="relative">
        {parsedMessage && (
          <div className={cn(
            "absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-background/80 backdrop-blur-sm border border-dashed px-2 py-1 rounded-full whitespace-nowrap",
            pendingTaskConfirmation ? "text-green-600 border-green-300" : "text-muted-foreground"
          )}>
            {parsedMessage}
          </div>
        )}
        
        <ChatMessageInput 
          message={inputMessage}
          setMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!canAccess || isCreatingTask}
          onFileUpload={onFileUpload}
          onCameraCapture={onCameraCapture}
          onStartVoiceInput={onStartVoiceInput}
          onStopVoiceInput={onStopVoiceInput}
          onConfirmTranscript={onConfirmTranscript}
          isListening={isListening}
          processingVoice={processingVoice}
          temporaryTranscript={temporaryTranscript}
          supportsPendingConfirmation={true}
          pendingConfirmation={pendingTaskConfirmation}
          confirmationHint="Confirm task creation"
        />
      </div>
    </Card>
  );
};
