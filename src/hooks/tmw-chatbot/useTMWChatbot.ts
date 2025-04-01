
import { useEffect, useRef } from "react";
import { useIsMobile } from "../useIsMobile";
import { cleanupExistingChatbotElements } from "./cleanupUtils";
import { injectIframeChatbot } from "./iframeHandler";
import { injectScriptChatbot } from "./scriptHandler";

/**
 * Hook to integrate TMW AI Chatbot into the application
 * @param chatbotEnabled Boolean indicating if the chatbot is enabled
 * @param chatbotCode The chatbot embed code (iframe or script)
 * @param containerId ID of the container element to place the chatbot in
 * @returns Reference to the chatbot element
 */
export const useTMWChatbot = (
  chatbotEnabled: boolean | undefined, 
  chatbotCode: string | undefined,
  containerId: string = 'tmw-chatbot-container'
) => {
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
    
    // Create or find the container element
    let container = document.getElementById(containerId);
    if (!container) {
      console.log(`Creating new TMW chatbot container with ID: ${containerId}`);
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    
    if (chatbotEnabled && chatbotCode) {
      try {
        console.log("TMW AI Chatbot is enabled");
        
        // Check if the code contains an iframe tag
        const isIframeEmbed = chatbotCode.trim().toLowerCase().includes('<iframe');
        
        if (isIframeEmbed) {
          // Handle iframe embed
          chatbotScriptRef.current = injectIframeChatbot(chatbotCode, containerId);
        } else {
          // Handle script-based embed
          chatbotScriptRef.current = injectScriptChatbot(chatbotCode, containerId);
        }
      } catch (error) {
        console.error('Error injecting TMW AI Chatbot code:', error);
      }
    } else if (container) {
      // Clear the container if chatbot is disabled
      container.innerHTML = '';
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
      
      // Clean up the container too
      const chatbotContainer = document.getElementById(containerId);
      if (chatbotContainer && chatbotContainer.parentNode) {
        chatbotContainer.parentNode.removeChild(chatbotContainer);
      }
    };
  }, [chatbotEnabled, chatbotCode, containerId, isMobile]);
  
  return chatbotScriptRef;
};
