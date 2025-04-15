
import { useAIAssistant } from './useAIAssistant';

// This is a wrapper hook for backward compatibility 
export const useTMWChatbot = () => {
  const assistantHook = useAIAssistant();
  
  return {
    ...assistantHook,
    // Any specific TMW chatbot properties would go here if needed
  };
};
