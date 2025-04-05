
import React, { useRef, useEffect, useState } from "react";
import { AIMessage, AIAssistantRole } from "@/types/ai-assistant.types";
import { Card, CardContent } from "@/components/ui/card";
import { MessageInputForm } from "./MessageInputForm";
import { AIAssistantChat } from "./AIAssistantChat";
import { EmptyStateView } from "./EmptyStateView";

interface CleanChatInterfaceProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  selectedRole: AIAssistantRole;
  userName?: string;
  canAccess: boolean;
  onFileUpload?: (file: File) => Promise<void>;
  onCameraCapture?: () => Promise<void>;
}

export function CleanChatInterface({
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
}: CleanChatInterfaceProps) {
  const [showSuggestions, setShowSuggestions] = useState(!messages || messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setShowSuggestions(false);
  };

  return (
    <Card className="flex-1 flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-210px)] overflow-hidden">
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && showSuggestions ? (
            <EmptyStateView
              onPromptClick={handlePromptClick}
              selectedRole={selectedRole}
            />
          ) : (
            <AIAssistantChat
              messages={messages}
              isLoading={isLoading}
              selectedRole={selectedRole}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-auto">
          <MessageInputForm
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            canAccess={canAccess}
            onFileUpload={onFileUpload}
            onCameraCapture={onCameraCapture}
          />
        </div>
      </CardContent>
    </Card>
  );
}
