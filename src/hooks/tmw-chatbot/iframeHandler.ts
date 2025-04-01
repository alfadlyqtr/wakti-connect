
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
  
  try {
    // Extract the iframe HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chatbotCode.trim();
    const iframe = tempDiv.querySelector('iframe');
    
    if (iframe) {
      // Set a unique ID on the iframe for future reference
      iframe.id = 'tmw-chatbot-iframe-' + Date.now();
      
      // Make sure the iframe takes up the full container space
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
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
      console.log('No iframe found in the code, inserting raw HTML');
      targetContainer.innerHTML = chatbotCode;
      const addedIframe = targetContainer.querySelector('iframe');
      
      if (addedIframe) {
        addedIframe.style.width = '100%';
        addedIframe.style.height = '100%';
        addedIframe.style.border = 'none';
        console.log('Found iframe in inserted HTML');
        return addedIframe as HTMLIFrameElement;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error processing iframe TMW chatbot code:', error);
    // Fallback: just set the HTML directly
    targetContainer.innerHTML = chatbotCode;
    return null;
  }
};
