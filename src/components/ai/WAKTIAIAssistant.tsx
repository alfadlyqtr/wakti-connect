import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIAssistantRole, AIMessage, RoleContexts, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { AIAssistantSettings } from './settings/AIAssistantSettings';
import { AIAssistantKnowledge } from './knowledge/AIAssistantKnowledge';
import { CleanChatInterface } from './assistant/CleanChatInterface';
import { cn } from '@/lib/utils';

interface WAKTIAIAssistantProps {
  isFullscreen?: boolean;
}

const WAKTIAIAssistant: React.FC<WAKTIAIAssistantProps> = ({ isFullscreen = false }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>('general');
  const [activeView, setActiveView] = useState<'chat' | 'settings' | 'knowledge'>('chat');
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    activeMode,
    setActiveMode,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge,
    isMessageProcessing,
    getCurrentProcessingMessage,
    retryLastMessage,
    hasFailedMessage,
    getTransactions,
    handleConfirmClear,
    showClearConfirmation,
    setShowClearConfirmation
  } = useAIAssistant();
  
  const { profile } = useAIAssistant();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    
    const result = await sendMessage(inputMessage);
    if (!result.keepInputText) {
      setInputMessage('');
    }
  };
  
  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    // Handle file upload logic here
  };
  
  const handleSetMode = (mode: WAKTIAIMode) => {
    console.log(`Setting AI mode to: ${mode}`);
    setActiveMode(mode);
  };
  
  return (
    <div className={cn("flex flex-col w-full", isFullscreen ? "h-[calc(100vh-64px)]" : "")}>
      <AIAssistantChatCard 
        activeView={activeView}
        setActiveView={setActiveView}
        activeMode={activeMode}
        handleSetMode={handleSetMode}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
      />
      
      {activeView === 'chat' && (
        // Replace with CleanChatInterface with new props
        <CleanChatInterface
          messages={messages}
          isLoading={isLoading}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          selectedRole={selectedRole}
          userName={profile?.full_name}
          canAccess={canUseAI}
          onFileUpload={handleFileUpload}
          showSuggestions={showSuggestions}
          detectedTask={detectedTask}
          onConfirmTask={confirmCreateTask}
          onCancelTask={cancelCreateTask}
          isCreatingTask={isCreatingTask}
          pendingTaskConfirmation={pendingTaskConfirmation}
          clearMessages={clearMessages}
          handleConfirmClear={handleConfirmClear}
          showClearConfirmation={showClearConfirmation}
          setShowClearConfirmation={setShowClearConfirmation}
        />
      )}
      
      <AnimatePresence>
        {activeView === 'settings' && (
          <AIAssistantSettings
            aiSettings={aiSettings}
            isLoading={isLoadingSettings}
            updateSettings={updateSettings}
            key="ai-settings"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {activeView === 'knowledge' && (
          <AIAssistantKnowledge
            addKnowledge={addKnowledge}
            knowledgeUploads={knowledgeUploads}
            isLoading={isLoadingKnowledge}
            deleteKnowledge={deleteKnowledge}
            key="ai-knowledge"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface AIAssistantChatCardProps {
  activeView: 'chat' | 'settings' | 'knowledge';
  setActiveView: (view: 'chat' | 'settings' | 'knowledge') => void;
  activeMode: WAKTIAIMode;
  handleSetMode: (mode: WAKTIAIMode) => void;
  selectedRole: AIAssistantRole;
  setSelectedRole: (role: AIAssistantRole) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

const AIAssistantChatCard: React.FC<AIAssistantChatCardProps> = ({
  activeView,
  setActiveView,
  activeMode,
  handleSetMode,
  selectedRole,
  setSelectedRole,
  showSuggestions,
  setShowSuggestions
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          WAKTI AI Chat
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveView(activeView === 'settings' ? 'chat' : 'settings')}
            className={activeView === 'settings' ? 'text-wakti-blue' : ''}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveView(activeView === 'knowledge' ? 'chat' : 'knowledge')}
            className={activeView === 'knowledge' ? 'text-wakti-blue' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0zm2.03-4.78a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06zM6 17.25a3.75 3.75 0 013.75-3.75h6a3.75 3.75 0 013.75 3.75v1.5a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75v-1.5z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mode">Mode</Label>
            <Select onValueChange={handleSetMode} defaultValue={activeMode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Chat</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setSelectedRole(value as AIAssistantRole)} defaultValue={selectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="writer">Writer</SelectItem>
                <SelectItem value="business_owner">Business Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Input
            id="show-suggestions"
            type="checkbox"
            checked={showSuggestions}
            onChange={(e) => setShowSuggestions(e.target.checked)}
          />
          <Label htmlFor="show-suggestions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Show Suggestions
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default WAKTIAIAssistant;
