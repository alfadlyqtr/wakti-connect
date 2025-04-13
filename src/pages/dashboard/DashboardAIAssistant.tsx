import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AIAssistantChat } from '@/components/ai/assistant/AIAssistantChat';
import { MessageInputForm } from '@/components/ai/assistant/MessageInputForm';
import { EmptyStateView } from '@/components/ai/assistant/EmptyStateView';
import { PoweredByTMW } from '@/components/ai/assistant/PoweredByTMW';
import { AIRoleSelector } from '@/components/ai/assistant/AIRoleSelector';
import { AIAssistantDocumentsCard } from '@/components/ai/AIAssistantDocumentsCard';
import { AIAssistantUpgradeCard } from '@/components/ai/AIAssistantUpgradeCard';
import { AIAssistantChatCard } from '@/components/ai/assistant/AIAssistantChatCard';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import { useUser } from '@/hooks/useUser';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TaskConfirmationCard } from '@/components/ai/task/TaskConfirmationCard';
import { Bot, Trash2, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/useIsMobile';

const DashboardAIAssistant = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    clearMessages, 
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    canUseAI,
    storeCurrentRole
  } = useAIAssistant();
  
  const { user, profile } = useUser();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>('general');
  const [storedRole, setStoredRole] = useLocalStorage<AIAssistantRole>('ai_assistant_role', 'general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Set sidebar closed by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);
  
  // Load stored role on component mount
  useEffect(() => {
    if (storedRole) {
      setSelectedRole(storedRole);
    }
  }, [storedRole]);
  
  // Store selected role when it changes
  useEffect(() => {
    setStoredRole(selectedRole);
    storeCurrentRole(selectedRole);
  }, [selectedRole, setStoredRole, storeCurrentRole]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    try {
      await sendMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleRoleChange = (role: AIAssistantRole) => {
    setSelectedRole(role);
    // Clear messages when changing roles
    clearMessages();
  };
  
  const handleUseDocumentContent = (content: string) => {
    setInputMessage(prev => {
      if (prev.trim()) {
        return `${prev}\n\n${content}`;
      }
      return content;
    });
  };
  
  // Get user's first name for greeting
  const userName = profile?.full_name?.split(' ')[0] || '';
  
  return (
    <div className="flex flex-col h-full">
      {/* Task confirmation overlay */}
      {pendingTaskConfirmation && detectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <TaskConfirmationCard
              taskInfo={detectedTask}
              onConfirm={confirmCreateTask}
              onCancel={cancelCreateTask}
              isLoading={isCreatingTask}
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 h-full">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          <AIAssistantChatCard
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            canAccess={canUseAI}
            clearMessages={clearMessages}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            userName={userName}
          />
        </div>
        
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-full md:w-80 space-y-4 flex flex-col">
            <Card className="shadow-md border-wakti-blue/10 overflow-hidden rounded-xl">
              <CardHeader className="py-3 px-4 border-b bg-gradient-to-r from-white to-gray-50">
                <CardTitle className="text-base flex items-center">
                  <Bot className="h-4 w-4 mr-1.5" />
                  Assistant Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Choose Assistant Type</h3>
                    <AIRoleSelector
                      selectedRole={selectedRole}
                      onRoleChange={handleRoleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <AIAssistantDocumentsCard
              canAccess={canUseAI}
              onUseDocumentContent={handleUseDocumentContent}
              selectedRole={selectedRole}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAIAssistant;
