
import { useEffect, useRef } from "react";

/**
 * Hook to inject and manage TMW Chatbot script
 */
export const useTMWChatbot = (
  enabled?: boolean,
  chatbotCode?: string
): React.RefObject<HTMLDivElement> => {
  const chatbotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !chatbotCode || !chatbotRef.current) {
      return;
    }

    try {
      // Safety check to ensure we're not injecting empty or invalid code
      if (chatbotCode.trim().length < 20) {
        console.warn("Chatbot code appears too short or invalid");
        return;
      }

      // Create a script element
      const script = document.createElement("script");
      script.innerHTML = chatbotCode;
      script.async = true;
      script.defer = true;
      
      // Add the script to the chatbot container
      chatbotRef.current.appendChild(script);
      
      // Clean up on unmount
      return () => {
        if (chatbotRef.current && chatbotRef.current.contains(script)) {
          chatbotRef.current.removeChild(script);
        }
      };
    } catch (error) {
      console.error("Error loading TMW chatbot script:", error);
    }
  }, [enabled, chatbotCode]);

  return chatbotRef;
};
