
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantChatCard } from "../assistant/AIAssistantChatCard";
import { AIAssistantRole, AIMessage } from "@/types/ai-assistant.types";
import { AIAssistantToolsCard } from "../tools/AIAssistantToolsCard";
import { AIAssistantHistoryCard } from "../AIAssistantHistoryCard";

interface AIAssistantTabsProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
  userName?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AIAssistantTabs: React.FC<AIAssistantTabsProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages,
  selectedRole,
  onRoleChange,
  userName,
  activeTab,
  setActiveTab
}) => {
  // Function to handle document content being used in the chat
  const handleUseDocumentContent = (content: string) => {
    setInputMessage(content);
    // Switch to chat tab
    setActiveTab("chat");
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full space-y-4"
    >
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="flex flex-col gap-4 focus-visible:outline-none">
        <AIAssistantChatCard
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
          clearMessages={clearMessages}
          selectedRole={selectedRole}
          onRoleChange={onRoleChange}
          userName={userName}
        />
      </TabsContent>
      
      <TabsContent value="tools" className="space-y-4 focus-visible:outline-none">
        <AIAssistantToolsCard
          canAccess={canAccess}
          onUseDocumentContent={handleUseDocumentContent}
          selectedRole={selectedRole}
        />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4 focus-visible:outline-none">
        <AIAssistantHistoryCard
          canAccess={canAccess}
        />
      </TabsContent>
    </Tabs>
  );
};
