
import { useIsMobile } from "../useIsMobile";

/**
 * Handles the injection of iframe-based TMW chatbots
 */
export const injectIframeChatbot = (
  chatbotCode: string,
  targetElementId: string = 'tmw-chatbot-container'
): HTMLIFrameElement | null => {
  console.log("Detected iframe embed for TMW AI Chatbot");
  
  // Find the target container
  const targetContainer = document.getElementById(targetElementId);
  
  if (!targetContainer) {
    console.error(`Target container #${targetElementId} not found for TMW chatbot`);
    return null;
  }
  
  // Extract the iframe HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = chatbotCode.trim();
  const iframe = tempDiv.querySelector('iframe');
  
  if (iframe) {
    // Set a unique ID on the iframe for future reference
    iframe.id = 'tmw-chatbot-iframe-' + Date.now();
    
    // Clear the container and add the iframe
    targetContainer.innerHTML = '';
    targetContainer.appendChild(iframe);
    
    console.log('TMW AI Chatbot iframe has been injected into', targetElementId, {
      id: iframe.id,
      src: iframe.src
    });
    
    return iframe as HTMLIFrameElement;
  } else {
    // If we couldn't extract the iframe, just insert the raw HTML
    targetContainer.innerHTML = chatbotCode;
    console.log('TMW AI Chatbot iframe code has been injected as raw HTML into', targetElementId);
    return null;
  }
};
