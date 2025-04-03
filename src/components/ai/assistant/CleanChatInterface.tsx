
import React, { useRef, useEffect } from "react";
import { AIMessage, AIAssistantRole } from "@/types/ai-assistant.types";
import { AIAssistantMessage } from "../message/AIAssistantMessage";
import { Loader2 } from "lucide-react";
import { getTimeBasedGreeting } from "@/lib/dateUtils";
import { QuickToolsCard } from "../tools/QuickToolsCard";
import { Card, CardContent } from "@/components/ui/card";
import { MessageInputForm } from "./MessageInputForm";

interface CleanChatInterfaceProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  selectedRole: AIAssistantRole;
  userName?: string;
  isSpeaking?: boolean;
  canAccess: boolean;
}

export const CleanChatInterface: React.FC<CleanChatInterfaceProps> = ({
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  selectedRole,
  userName,
  isSpeaking = false,
  canAccess
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = messages.length === 0;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Get welcome message based on role
  const getWelcomeMessage = () => {
    const timeGreeting = getTimeBasedGreeting(userName);
    let roleSpecific = "";
    
    switch (selectedRole) {
      case "student":
        roleSpecific = "I can help with your assignments, study planning, and educational needs.";
        break;
      case "employee":
        roleSpecific = "I can help manage your work tasks, meetings, and professional commitments.";
        break;
      case "writer":
        roleSpecific = "I can assist with your creative projects, content creation, and writing challenges.";
        break;
      case "business_owner":
        roleSpecific = "I can help with business operations, staff management, and analytics insights.";
        break;
      default:
        roleSpecific = "I can help with tasks, scheduling, and general productivity.";
    }
    
    return `${timeGreeting}! I'm your WAKTI AI Assistant. ${roleSpecific} What can I help you with today?`;
  };
  
  // Welcome message as an AIMessage
  const welcomeMessage: AIMessage = {
    id: "welcome-message",
    role: "assistant",
    content: getWelcomeMessage(),
    timestamp: new Date(),
  };
  
  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome UI for empty state */}
          {isFirstMessage && (
            <div className="space-y-6">
              <AIAssistantMessage 
                message={welcomeMessage} 
                isActive={true}
                isSpeaking={isSpeaking}
              />
              
              <QuickToolsCard 
                selectedRole={selectedRole}
                onToolClick={(tool) => setInputMessage(tool)}
              />
            </div>
          )}
          
          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-4">
              {messages.map((message) => (
                <AIAssistantMessage
                  key={message.id}
                  message={message}
                  isActive={message.role === "assistant"}
                  isSpeaking={isSpeaking && message.id === messages[messages.length - 1].id && message.role === "assistant"}
                />
              ))}
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-wakti-blue flex items-center justify-center flex-shrink-0">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <div className="p-3 bg-muted rounded-lg max-w-[80%]">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input form */}
        <MessageInputForm
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
        />
      </CardContent>
    </Card>
  );
};
