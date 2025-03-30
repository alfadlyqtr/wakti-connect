
import { useEffect, useRef } from "react";

export const useTMWChatbot = (chatbotEnabled: boolean | undefined, chatbotCode: string | undefined) => {
  const chatbotScriptRef = useRef<HTMLScriptElement | null>(null);
  
  useEffect(() => {
    // Clear any previously added chatbot scripts
    if (chatbotScriptRef.current) {
      try {
        document.body.removeChild(chatbotScriptRef.current);
        chatbotScriptRef.current = null;
      } catch (error) {
        console.error("Error removing previous chatbot script:", error);
      }
    }
    
    const existingScripts = document.querySelectorAll('[id^="tmw-chatbot"]');
    existingScripts.forEach(script => {
      try {
        script.parentNode?.removeChild(script);
      } catch (err) {
        console.error("Error removing existing chatbot script:", err);
      }
    });
    
    if (chatbotEnabled && chatbotCode) {
      try {
        console.log("TMW AI Chatbot is enabled with code:", chatbotCode);
        
        // Create a script element
        const script = document.createElement('script');
        script.id = 'tmw-chatbot-script-' + Date.now(); // Unique ID to avoid conflicts
        chatbotScriptRef.current = script;
        
        // Clean the chatbot code
        let cleanCode = chatbotCode.trim();
        
        // Set the script content
        if (cleanCode.startsWith('<script>') && cleanCode.endsWith('</script>')) {
          // Extract code from within script tags
          cleanCode = cleanCode.substring(8, cleanCode.length - 9);
        }
        
        // Add the script content directly to the script tag
        script.textContent = cleanCode;
        
        // Append to document body for better visibility
        document.body.appendChild(script);
        
        console.log('TMW AI Chatbot script has been injected', {
          id: script.id,
          content: cleanCode.substring(0, 50) + '...' // Log just the beginning for debugging
        });
      } catch (error) {
        console.error('Error injecting TMW AI Chatbot script:', error);
      }
    } else {
      console.log("TMW AI Chatbot is disabled or has no code", {
        enabled: chatbotEnabled,
        hasCode: !!chatbotCode
      });
    }
    
    // Cleanup function
    return () => {
      if (chatbotScriptRef.current) {
        try {
          document.body.removeChild(chatbotScriptRef.current);
          chatbotScriptRef.current = null;
        } catch (error) {
          console.error('Error removing TMW chatbot script on unmount:', error);
        }
      }
    };
  }, [chatbotEnabled, chatbotCode]);
  
  return chatbotScriptRef;
};
