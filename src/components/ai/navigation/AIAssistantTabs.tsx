
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageCircle, FileText, History } from "lucide-react";
import { AIAssistantChatCard } from "@/components/ai/assistant";
import { AIToolsTabContent } from "@/components/ai/tools/AIToolsTabContent";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { AIFeatureCards } from "@/components/ai/features/AIFeatureCards";
import { AIMessage, AIAssistantRole } from "@/types/ai-assistant.types";

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
  setActiveTab,
}) => {
  const handleUseDocumentContent = (content: string) => {
    setInputMessage((prev) => prev ? `${prev}\n\n${content}` : content);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-2 justify-start">
        <TabsTrigger value="chat" className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1.5" />
          <span>Chat</span>
        </TabsTrigger>
        <TabsTrigger value="tools" className="flex items-center">
          <FileText className="h-4 w-4 mr-1.5" />
          <span>Tools</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center">
          <History className="h-4 w-4 mr-1.5" />
          <span>History</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
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
        </div>
      </TabsContent>
      
      <TabsContent value="tools" className="mt-0">
        <AIToolsTabContent 
          canAccess={canAccess} 
          onUseDocumentContent={handleUseDocumentContent}
          selectedRole={selectedRole}
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-0">
        <AIAssistantHistoryCard canAccess={canAccess} />
      </TabsContent>
      
      <AIFeatureCards />
    </Tabs>
  );
};
