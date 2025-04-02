
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AIAssistantChatCard } from "@/components/ai/assistant";
import { useAIAssistant } from "@/hooks/useAIAssistant";

export const AIChat: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    canUseAI, 
    clearMessages 
  } = useAIAssistant();
  const [inputMessage, setInputMessage] = useState("");
  const location = useLocation();
  
  // Check if we have an initial prompt from the dashboard quick actions
  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      setInputMessage(state.initialPrompt);
      // Clear the state so it doesn't persist on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !canUseAI) {
      return;
    }
    
    await sendMessage.mutateAsync(inputMessage);
    setInputMessage("");
  };

  return (
    <AIAssistantChatCard
      messages={messages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      handleSendMessage={handleSendMessage}
      isLoading={isLoading}
      canAccess={canUseAI}
      clearMessages={clearMessages}
    />
  );
};
