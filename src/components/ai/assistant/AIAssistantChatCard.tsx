
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
  
  // Get role-specific title and styles
  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'student': return 'Study Assistant';
      case 'professional': return 'Work Assistant';
      case 'creator': return 'Creator Assistant';
      case 'business_owner': return 'Business Assistant';
      default: return 'AI Assistant';
    }
  };
  
  const getRoleColor = () => {
    switch (selectedRole) {
      case 'student': return 'from-blue-600 to-blue-500';
      case 'professional': return 'from-purple-600 to-purple-500';
      case 'creator': return 'from-green-600 to-green-500';
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
    <div className="flex h-[calc(75vh)] rounded-xl overflow-hidden">
      {/* Chat area */}
      <Card className="flex-1 flex flex-col shadow-md border-wakti-blue/10 overflow-hidden rounded-xl">
        <div className="py-2 px-3 sm:py-3 sm:px-4 border-b flex justify-between items-center bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center">
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center flex-shrink-0 mr-2 shadow-sm`}>
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-medium flex items-center gap-1.5">
                <span>WAKTI {getRoleTitle()}</span>
                {messages.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearMessages}
                    className="h-6 w-6 hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Clear chat"
                    title="Clear chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">{greeting}{userName ? `, ${userName}` : ''}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50 hover:text-blue-500 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50 hover:text-blue-500 transition-colors"
              aria-label="Settings"
              title="Assistant Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
          {/* Role Selector Bar */}
          <div className="p-3 border-b bg-white">
            <AIRoleSelector selectedRole={selectedRole} onRoleChange={onRoleChange} />
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {messages.length === 0 && showSuggestions ? (
              <EmptyStateView onPromptClick={handlePromptClick} selectedRole={selectedRole} />
            ) : (
              <AIAssistantChat 
                messages={messages} 
                isLoading={isLoading}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                canAccess={canAccess}
                selectedRole={selectedRole}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input Form */}
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
      
      {/* Sidebar - Only shown when open */}
      {isSidebarOpen && (
        <div className="w-72 border-l ml-4 rounded-xl border overflow-hidden bg-white shadow-md">
          <div className="py-3 px-4 border-b bg-gray-50 font-medium text-sm">
            AI Assistant Tools
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                  1
                </span>
                File Upload
              </h4>
              <div className="border border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xs text-muted-foreground">
                  Upload documents for the AI to analyze
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                  2
                </span>
                Voice Recording
              </h4>
              <div className="border border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xs text-muted-foreground">
                  Record voice for transcription and analysis
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs">
                  3
                </span>
                Camera Capture
              </h4>
              <div className="border border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xs text-muted-foreground">
                  Take photos for the AI to analyze
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs">
                  4
                </span>
                Saved Chats
              </h4>
              <div className="border border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xs text-muted-foreground">
                  Access your chat history and saved conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
