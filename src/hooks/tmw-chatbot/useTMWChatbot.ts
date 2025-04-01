
import { useEffect, useRef } from "react";
import { useIsMobile } from "../useIsMobile";
import { cleanupExistingChatbotElements } from "./cleanupUtils";
import { injectIframeChatbot } from "./iframeHandler";
import { injectScriptChatbot } from "./scriptHandler";

/**
 * Hook to integrate TMW AI Chatbot into the application
 * @param chatbotEnabled Boolean indicating if the chatbot is enabled
 * @param chatbotCode The chatbot embed code (iframe or script)
 * @returns Reference to the chatbot element
 */
export const useTMWChatbot = (chatbotEnabled: boolean | undefined, chatbotCode: string | undefined) => {
  const chatbotScriptRef = useRef<HTMLScriptElement | HTMLIFrameElement | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Clear any previously added chatbot elements
    if (chatbotScriptRef.current) {
      try {
        if (chatbotScriptRef.current.parentNode) {
          chatbotScriptRef.current.parentNode.removeChild(chatbotScriptRef.current);
        }
        chatbotScriptRef.current = null;
      } catch (error) {
        console.error("Error removing previous chatbot element:", error);
      }
    }
    
    // Remove any existing chatbot elements from DOM
    cleanupExistingChatbotElements();
    
    if (chatbotEnabled && chatbotCode) {
      try {
        console.log("TMW AI Chatbot is enabled");
        
        // Check if the code contains an iframe tag
        const isIframeEmbed = chatbotCode.trim().toLowerCase().includes('<iframe');
        
        if (isIframeEmbed) {
          // Handle iframe embed
          chatbotScriptRef.current = injectIframeChatbot(chatbotCode, isMobile);
        } else {
          // Handle script-based embed
          chatbotScriptRef.current = injectScriptChatbot(chatbotCode);
        }
      } catch (error) {
        console.error('Error injecting TMW AI Chatbot code:', error);
      }
    }
    
    // Cleanup function
    return () => {
      if (chatbotScriptRef.current && chatbotScriptRef.current.parentNode) {
        try {
          chatbotScriptRef.current.parentNode.removeChild(chatbotScriptRef.current);
          chatbotScriptRef.current = null;
        } catch (error) {
          console.error('Error removing TMW chatbot element on unmount:', error);
        }
      }
      
      // Clean up any other elements that might have been created
      cleanupExistingChatbotElements();
    };
  }, [chatbotEnabled, chatbotCode, isMobile]);
  
  return chatbotScriptRef;
};
