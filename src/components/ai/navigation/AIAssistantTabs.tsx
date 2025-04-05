
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantChatCard } from "../assistant/AIAssistantChatCard";
import { AIAssistantRole, AIMessage } from "@/types/ai-assistant.types";
import { AIAssistantToolsCard } from "../tools/AIAssistantToolsCard";
import { AIAssistantHistoryCard } from "../AIAssistantHistoryCard";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, MessageSquare, Wrench, History, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Get role-specific color
  const getRoleColor = () => {
    switch (selectedRole) {
      case "student": return "from-blue-600 to-blue-500";
      case "work": return "from-purple-600 to-purple-500";
      case "employee": return "from-purple-600 to-purple-500"; // Map employee to work colors
      case "writer": return "from-purple-600 to-purple-500"; // Map writer to work colors
      case "business_owner": return "from-amber-600 to-amber-500";
      default: return "from-wakti-blue to-wakti-blue/90";
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Header with animated highlight */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center mb-2"
      >
        <div className={cn(
          "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center mr-3",
          getRoleColor()
        )}>
          <Bot className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-center relative">
          WAKTI AI Assistant
          <motion.span 
            className="absolute -right-7 top-0"
            initial={{ rotate: -20, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.span>
        </h2>
      </motion.div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Tools</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent 
            value="chat" 
            className="flex flex-col gap-4 focus-visible:outline-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </TabsContent>
          
          <TabsContent 
            value="tools" 
            className="space-y-4 focus-visible:outline-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIAssistantToolsCard
                canAccess={canAccess}
                onUseDocumentContent={handleUseDocumentContent}
                selectedRole={selectedRole}
              />
            </motion.div>
          </TabsContent>
          
          <TabsContent 
            value="history" 
            className="space-y-4 focus-visible:outline-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIAssistantHistoryCard
                canAccess={canAccess}
              />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
