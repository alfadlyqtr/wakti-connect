
import { useIsMobile } from "../useIsMobile";

/**
 * Handles the injection of iframe-based TMW chatbots
 */
export const injectIframeChatbot = (
  chatbotCode: string,
  isMobile: boolean
): HTMLIFrameElement | null => {
  console.log("Detected iframe embed for TMW AI Chatbot");
  
  // Create a container for the iframe with improved styling
  const container = document.createElement('div');
  container.id = 'tmw-chatbot-container-' + Date.now();
  container.className = 'tmw-chatbot-container';
  
  // Enhanced styling for the container
  container.style.position = 'fixed';
  container.style.bottom = isMobile ? '80px' : '32px';
  container.style.right = isMobile ? '16px' : '24px';
  container.style.zIndex = '9999';
  container.style.maxWidth = '100%';
  container.style.maxHeight = '85vh';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  container.style.borderRadius = '16px';
  container.style.overflow = 'hidden';
  container.style.margin = '10px';
  container.style.padding = '8px';
  
  // Extract the iframe HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = chatbotCode.trim();
  const iframe = tempDiv.querySelector('iframe');
  
  if (iframe) {
    // Set a unique ID on the iframe for future reference
    iframe.id = 'tmw-chatbot-iframe-' + Date.now();
    
    // Improve iframe styling
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.maxWidth = isMobile ? '320px' : '380px';
    iframe.style.maxHeight = isMobile ? '550px' : '650px';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    iframe.style.display = 'block';
    
    // Add the iframe to the container, then add container to the body
    container.appendChild(iframe);
    document.body.appendChild(container);
    
    console.log('TMW AI Chatbot iframe has been injected:', {
      id: iframe.id,
      src: iframe.src
    });
    
    return iframe as HTMLIFrameElement;
  } else {
    // If we couldn't extract the iframe, just insert the raw HTML
    container.innerHTML = chatbotCode;
    document.body.appendChild(container);
    console.log('TMW AI Chatbot iframe code has been injected as raw HTML');
    return null;
  }
};
