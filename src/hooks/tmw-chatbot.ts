
import { useEffect, useRef } from "react";
import { useAIAssistant } from './useAIAssistant';
import { cleanupExistingChatbotElements } from './tmw-chatbot/cleanupUtils';
import { injectIframeChatbot } from './tmw-chatbot/iframeHandler';
import { injectScriptChatbot } from './tmw-chatbot/scriptHandler';
import { useIsMobile } from "./useIsMobile";

// Updated to properly handle the chatbot code and container
export const useTMWChatbot = () => {
  const chatbotScriptRef = useRef<HTMLScriptElement | HTMLIFrameElement | null>(null);
  const initializedRef = useRef(false);
  const assistantHook = useAIAssistant();
  const isMobile = useIsMobile();
  
  const initChatbot = (chatbotEnabled: boolean, chatbotCode: string, containerId: string) => {
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
    
    // Return cleanup function
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
  };
  
  return {
    ...assistantHook,
    chatbotRef: chatbotScriptRef,
    initChatbot
  };
};
