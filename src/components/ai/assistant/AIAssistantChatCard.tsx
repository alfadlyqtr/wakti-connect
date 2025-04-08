
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Trash2, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import { AIAssistantChat } from './AIAssistantChat';
import { MessageInputForm } from './MessageInputForm';
import { EmptyStateView } from './EmptyStateView';
import { PoweredByTMW } from './PoweredByTMW';
import { AIRoleSelector } from './AIRoleSelector';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';

interface AIAssistantChatCardProps {
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
}

export const AIAssistantChatCard: React.FC<AIAssistantChatCardProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages,
  selectedRole,
  onRoleChange,
  userName
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'student': return t("ai.roles.student", "Student Assistant");
      case 'employee': return t("ai.roles.employee", "Creative Assistant");
      case 'writer': return t("ai.roles.writer", "Creative Assistant");
      case 'business_owner': return t("ai.roles.business", "Business Assistant");
      default: return t("ai.roles.general", "AI Assistant");
    }
  };

  const getRoleColor = () => {
    switch (selectedRole) {
      case 'student': return 'from-blue-600 to-blue-500';
      case 'employee': return 'from-purple-600 to-purple-500';
      case 'writer': return 'from-purple-600 to-purple-500';
      case 'business_owner': return 'from-amber-600 to-amber-500';
      default: return 'from-wakti-blue to-wakti-blue/90';
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setShowSuggestions(false);
  };

  const greeting = getTimeBasedGreeting(userName);

  return (
    <Card className="flex-1 flex flex-col shadow-md border-wakti-blue/10 overflow-hidden rounded-xl">
      <div className="py-2 px-2 sm:py-3 sm:px-4 border-b flex justify-between items-center bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center">
          <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center flex-shrink-0 mr-2 shadow-sm`}>
            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xs sm:text-sm md:text-base font-medium flex items-center gap-1.5">
              <span className="truncate max-w-[80px] xs:max-w-[120px] sm:max-w-full">WAKTI {getRoleTitle()}</span>
              {messages.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearMessages}
                  className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label={t("ai.clearChat", "Clear chat")}
                  title={t("ai.clearChat", "Clear chat")}
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              )}
              <Badge 
                variant="outline" 
                className="ml-2 text-[8px] sm:text-[10px] px-1.5 py-0 h-4 sm:h-5 bg-wakti-blue/5 hidden xs:inline-flex"
              >
                v2.0
              </Badge>
            </h3>
            <p className="text-[10px] xs:text-xs text-muted-foreground truncate">{greeting}{userName ? `, ${userName}` : ''}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? t("ai.closeSidebar", "Close sidebar") : t("ai.openSidebar", "Open sidebar")}
            title={isSidebarOpen ? t("ai.closeSidebar", "Close sidebar") : t("ai.openSidebar", "Open sidebar")}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <PanelLeftOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            aria-label={t("ai.settings", "Settings")}
            title={t("ai.settings", "Assistant Settings")}
            asChild
          >
            <a href="/dashboard/settings?tab=ai-assistant">
              <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
        <div className="p-1.5 sm:p-3 border-b bg-white">
          <AIRoleSelector selectedRole={selectedRole} onRoleChange={onRoleChange} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main chat area - larger by default */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4">
            <AIAssistantChat 
              messages={messages} 
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              canAccess={canAccess}
              selectedRole={selectedRole}
            />
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Sidebar with suggestions - shown conditionally and narrower */}
          {messages.length === 0 && showSuggestions && isSidebarOpen && !isMobile && (
            <div className="w-1/4 min-w-[180px] sm:min-w-[200px] max-w-[250px] border-l p-2 sm:p-3 overflow-y-auto bg-gray-50/50 hidden sm:block">
              <EmptyStateView onPromptClick={handlePromptClick} selectedRole={selectedRole} />
            </div>
          )}
          
          {/* Mobile sidebar with suggestions */}
          {messages.length === 0 && showSuggestions && isSidebarOpen && isMobile && (
            <div className="absolute inset-0 z-10 bg-white p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">{t("ai.suggestedPrompts", "Suggested Prompts")}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-7 w-7"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <EmptyStateView onPromptClick={(prompt) => {
                handlePromptClick(prompt);
                setIsSidebarOpen(false);
              }} selectedRole={selectedRole} />
            </div>
          )}
        </div>
        
        <MessageInputForm
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
        />
        
        <PoweredByTMW />
      </CardContent>
    </Card>
  );
};
