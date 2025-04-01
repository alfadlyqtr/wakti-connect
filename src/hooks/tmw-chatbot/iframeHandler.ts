
import { useIsMobile } from "../useIsMobile";

/**
 * Handles the injection of iframe-based TMW chatbots
 */
export const injectIframeChatbot = (
  chatbotCode: string,
  isMobile: boolean
): HTMLIFrameElement | null => {
  console.log("Detected iframe embed for TMW AI Chatbot");
  
  // Extract the iframe HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = chatbotCode.trim();
  const iframe = tempDiv.querySelector('iframe');
  
  if (iframe) {
    // Set a unique ID on the iframe for future reference
    iframe.id = 'tmw-chatbot-iframe-' + Date.now();
    
    // Add the iframe directly to the body without a container
    document.body.appendChild(iframe);
    
    console.log('TMW AI Chatbot iframe has been injected:', {
      id: iframe.id,
      src: iframe.src
    });
    
    return iframe as HTMLIFrameElement;
  } else {
    // If we couldn't extract the iframe, just insert the raw HTML
    const div = document.createElement('div');
    div.innerHTML = chatbotCode;
    document.body.appendChild(div);
    console.log('TMW AI Chatbot iframe code has been injected as raw HTML');
    return null;
  }
};
