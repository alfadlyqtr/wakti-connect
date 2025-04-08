
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantChatCard } from "../assistant/AIAssistantChatCard";
import { AIAssistantRole, AIMessage } from "@/types/ai-assistant.types";
import { AIAssistantToolsCard } from "../tools/AIAssistantToolsCard";
import { AIAssistantHistoryCard } from "../AIAssistantHistoryCard";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, MessageSquare, Wrench, History, Bot, Sparkles, BookOpen, Briefcase, Pen, BookCopy } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleSpecificKnowledge } from "../tools/RoleSpecificKnowledge";
import { KnowledgeProfileToolCard } from "../tools/KnowledgeProfileToolCard";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const handleUseDocumentContent = (content: string) => {
    setInputMessage(content);
    setActiveTab("chat");
  };

  const getRoleColor = () => {
    switch (selectedRole) {
      case "student": return "from-blue-600 to-blue-500";
      case "employee": return "from-purple-600 to-purple-500";
      case "writer": return "from-green-600 to-green-500";
      case "business_owner": return "from-amber-600 to-amber-500";
      default: return "from-wakti-blue to-wakti-blue/90";
    }
  };

  const getRoleIcon = () => {
    switch (selectedRole) {
      case "student": return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      case "employee": 
      case "writer": return <Pen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      case "business_owner": return <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      default: return <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
    }
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case "student": return t("ai.roles.student", "Student Assistant");
      case "employee": 
      case "writer": return t("ai.roles.writer", "Creative Assistant");
      case "business_owner": return t("ai.roles.business", "Business Assistant");
      default: return t("ai.roles.general", "AI Assistant");
    }
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center mb-1 sm:mb-2"
      >
        <div className={cn(
          "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br flex items-center justify-center mr-2 sm:mr-3",
          getRoleColor()
        )}>
          {getRoleIcon()}
        </div>
        <h2 className="text-lg sm:text-xl xs:text-2xl font-bold text-center relative truncate max-w-[180px] xs:max-w-[200px] sm:max-w-full">
          <span className="hidden xs:inline">WAKTI</span> {getRoleTitle()}
          {!isMobile && (
            <motion.span 
              className="absolute -right-7 top-0 hidden sm:inline-block"
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </motion.span>
          )}
        </h2>
      </motion.div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full space-y-3 sm:space-y-4"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto overflow-x-auto">
          <TabsTrigger value="chat" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{t("ai.tabs.chat", "Chat")}</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
            <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{t("ai.tabs.tools", "Tools")}</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
            <BookCopy className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{t("ai.tabs.knowledge", "Knowledge")}</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{t("ai.tabs.history", "History")}</span>
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
            value="knowledge" 
            className="space-y-4 focus-visible:outline-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <KnowledgeProfileToolCard selectedRole={selectedRole} />
                <RoleSpecificKnowledge
                  selectedRole={selectedRole}
                  canAccess={canAccess}
                />
              </div>
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
