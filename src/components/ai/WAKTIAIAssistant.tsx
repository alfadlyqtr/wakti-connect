
import React, { useState } from 'react';
import { AIAssistantRole, AIMessage, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { CleanChatInterface } from './assistant/CleanChatInterface';
import { AIAssistantHeader } from './navigation/AIAssistantHeader';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface WAKTIAIAssistantProps {
  isFullscreen?: boolean;
}

const WAKTIAIAssistant: React.FC<WAKTIAIAssistantProps> = ({ isFullscreen = false }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>('general');
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  
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
    canUseAI,
    handleConfirmClear,
    showClearConfirmation,
    setShowClearConfirmation
  } = useAIAssistant();
  
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
  
  return (
    <div className="flex flex-col w-full">
      <AIAssistantHeader 
        userName={profile?.full_name}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        isSpeechEnabled={false}
        onToggleSpeech={() => {}}
        isListening={false}
      />
      
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
    </div>
  );
};

export default WAKTIAIAssistant;
