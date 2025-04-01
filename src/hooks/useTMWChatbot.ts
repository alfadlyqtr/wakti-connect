
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
    
    // Also remove any other TMW chatbot scripts that might exist
    const existingScripts = document.querySelectorAll('[id^="tmw-chatbot"]');
    existingScripts.forEach(script => {
      try {
        script.parentNode?.removeChild(script);
      } catch (err) {
        console.error("Error removing existing chatbot script:", err);
      }
    });
    
    // Remove any existing chatbot containers
    const chatbotContainers = document.querySelectorAll('.tmw-chat-container, .tmw-chatbot-container');
    chatbotContainers.forEach(container => {
      try {
        container.parentNode?.removeChild(container);
      } catch (err) {
        console.error("Error removing chatbot container:", err);
      }
    });
    
    if (chatbotEnabled && chatbotCode) {
      try {
        console.log("TMW AI Chatbot is enabled with code:", chatbotCode.substring(0, 100) + "...");
        
        // Check if the chatbot code contains a src attribute
        const srcMatch = chatbotCode.match(/src=["']([^"']+)["']/);
        
        if (srcMatch && srcMatch[1]) {
          // This is an external script
          const scriptSrc = srcMatch[1];
          console.log("Detected external script with src:", scriptSrc);
          
          // Create a script element with the src attribute
          const script = document.createElement('script');
          script.id = 'tmw-chatbot-script-' + Date.now(); // Unique ID to avoid conflicts
          script.src = scriptSrc;
          
          // Copy any other attributes from the original script tag
          const idMatch = chatbotCode.match(/id=["']([^"']+)["']/);
          if (idMatch && idMatch[1]) script.id = idMatch[1];
          
          const asyncAttr = chatbotCode.includes('async');
          if (asyncAttr) script.async = true;
          
          const deferAttr = chatbotCode.includes('defer');
          if (deferAttr) script.defer = true;
          
          // Store reference and append to document
          chatbotScriptRef.current = script;
          document.body.appendChild(script);
          
          console.log('TMW AI Chatbot external script has been injected:', {
            id: script.id,
            src: scriptSrc
          });
        } else {
          // This is an inline script
          const script = document.createElement('script');
          script.id = 'tmw-chatbot-script-' + Date.now(); // Unique ID to avoid conflicts
          chatbotScriptRef.current = script;
          
          // Clean the chatbot code
          let cleanCode = chatbotCode.trim();
          
          // Extract code from within script tags if present
          if (cleanCode.startsWith('<script>') && cleanCode.endsWith('</script>')) {
            cleanCode = cleanCode.substring(8, cleanCode.length - 9);
          }
          
          // Add the script content directly to the script tag
          script.textContent = cleanCode;
          
          // Append to document body for better visibility
          document.body.appendChild(script);
          
          console.log('TMW AI Chatbot inline script has been injected', {
            id: script.id,
            contentPreview: cleanCode.substring(0, 50) + '...'
          });
        }
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
