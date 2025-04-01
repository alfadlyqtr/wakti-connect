
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
        
        // Check if the chatbot code contains a script tag
        const isFullScriptTag = chatbotCode.trim().startsWith('<script') && chatbotCode.trim().endsWith('</script>');
        
        // Extract the src attribute if it exists
        const srcMatch = chatbotCode.match(/src=["']([^"']+)["']/);
        const scriptSrc = srcMatch ? srcMatch[1] : null;
        
        // Extract the content between script tags if it exists
        let scriptContent = '';
        if (isFullScriptTag) {
          const contentMatch = chatbotCode.match(/<script[^>]*>([\s\S]*?)<\/script>/);
          scriptContent = contentMatch && contentMatch[1] ? contentMatch[1].trim() : '';
        } else {
          // If it's not wrapped in script tags, use the entire code as content
          scriptContent = chatbotCode.trim();
        }
        
        console.log("Script analysis:", { 
          hasScriptTag: isFullScriptTag, 
          hasSrc: !!scriptSrc, 
          hasContent: !!scriptContent.length,
          srcPreview: scriptSrc ? scriptSrc.substring(0, 50) + "..." : "none",
          contentPreview: scriptContent ? scriptContent.substring(0, 50) + "..." : "none"
        });
        
        // Create a new script element
        const script = document.createElement('script');
        script.id = 'tmw-chatbot-script-' + Date.now(); // Unique ID to avoid conflicts
        
        // Copy any other attributes from the original script tag
        const idMatch = chatbotCode.match(/id=["']([^"']+)["']/);
        if (idMatch && idMatch[1]) script.id = idMatch[1];
        
        const asyncAttr = chatbotCode.includes('async');
        if (asyncAttr) script.async = true;
        
        const deferAttr = chatbotCode.includes('defer');
        if (deferAttr) script.defer = true;
        
        // Handle different script scenarios
        if (scriptSrc && scriptContent.length > 0) {
          // Case 1: Both src and content - create src script first, then content script
          console.log("Creating TWO scripts - one with src and one with content");
          
          // First create and append the src script
          const srcScript = document.createElement('script');
          srcScript.id = 'tmw-chatbot-src-script-' + Date.now();
          srcScript.src = scriptSrc;
          if (asyncAttr) srcScript.async = true;
          if (deferAttr) srcScript.defer = true;
          document.body.appendChild(srcScript);
          
          // Then create and append the content script
          const contentScript = document.createElement('script');
          contentScript.id = 'tmw-chatbot-content-script-' + Date.now();
          contentScript.textContent = scriptContent;
          chatbotScriptRef.current = contentScript; // Track this one for cleanup
          
          // Add a small delay to ensure the src script loads first
          setTimeout(() => {
            document.body.appendChild(contentScript);
          }, 100);
          
          console.log('TMW AI Chatbot hybrid scripts have been injected:', {
            srcScriptId: srcScript.id,
            contentScriptId: contentScript.id
          });
        } else if (scriptSrc) {
          // Case 2: Only src attribute
          script.src = scriptSrc;
          chatbotScriptRef.current = script;
          document.body.appendChild(script);
          
          console.log('TMW AI Chatbot external script has been injected:', {
            id: script.id,
            src: scriptSrc
          });
        } else {
          // Case 3: Only inline content
          script.textContent = scriptContent;
          chatbotScriptRef.current = script;
          document.body.appendChild(script);
          
          console.log('TMW AI Chatbot inline script has been injected:', {
            id: script.id,
            contentPreview: scriptContent.substring(0, 50) + '...'
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
      
      // Also clean up any other scripts that might have been created
      const chatbotScripts = document.querySelectorAll('[id^="tmw-chatbot"]');
      chatbotScripts.forEach(script => {
        try {
          script.parentNode?.removeChild(script);
        } catch (err) {
          console.error('Error removing additional chatbot script on unmount:', err);
        }
      });
    };
  }, [chatbotEnabled, chatbotCode]);
  
  return chatbotScriptRef;
};
