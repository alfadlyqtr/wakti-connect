
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
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Skip if no code or disabled
    if (!chatbotEnabled || !chatbotCode || chatbotCode.trim() === '') {
      console.log("TMW AI Chatbot is disabled or has no code");
      return;
    }
    
    console.log(`Initializing TMW AI Chatbot (${initializedRef.current ? 'reinit' : 'first init'})`, {
      containerId,
      codeLength: chatbotCode.length,
      isScriptTag: chatbotCode.includes('<script'),
      isIframeTag: chatbotCode.includes('<iframe')
    });
    
    // Cleanup previous instance if needed
    if (initializedRef.current) {
      console.log("Cleaning up previous TMW chatbot instance");
      cleanupExistingChatbotElements();
      
      if (chatbotScriptRef.current && chatbotScriptRef.current.parentNode) {
        try {
          chatbotScriptRef.current.parentNode.removeChild(chatbotScriptRef.current);
        } catch (error) {
          console.error("Error removing previous chatbot element:", error);
        }
      }
      chatbotScriptRef.current = null;
    }
    
    // Set a small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        // Check if the code contains an iframe tag
        const isIframeEmbed = chatbotCode.trim().toLowerCase().includes('<iframe');
        
        if (isIframeEmbed) {
          // Handle iframe embed
          console.log("Detected iframe-based TMW chatbot, injecting...");
          chatbotScriptRef.current = injectIframeChatbot(chatbotCode, containerId);
        } else {
          // Handle script-based embed
          console.log("Detected script-based TMW chatbot, injecting...");
          chatbotScriptRef.current = injectScriptChatbot(chatbotCode, containerId);
        }
        
        initializedRef.current = true;
      } catch (error) {
        console.error('Error injecting TMW AI Chatbot code:', error);
      }
    }, 300);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      
      if (chatbotScriptRef.current && chatbotScriptRef.current.parentNode) {
        try {
          chatbotScriptRef.current.parentNode.removeChild(chatbotScriptRef.current);
          chatbotScriptRef.current = null;
        } catch (error) {
          console.error('Error removing TMW chatbot element on unmount:', error);
        }
      }
    };
  }, [chatbotEnabled, chatbotCode, containerId, isMobile]);
  
  return chatbotScriptRef;
};
