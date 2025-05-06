
import { useAIAssistant } from './useAIAssistant';

// Updated to remove parameters that are no longer needed in our new architecture
export const useTMWChatbot = () => {
  const assistantHook = useAIAssistant();
  
  return {
    ...assistantHook,
    // Any specific TMW chatbot properties would go here if needed
  };
};
