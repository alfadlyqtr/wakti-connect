
/**
 * Utility functions for cleaning up TMW chatbot elements from the DOM
 */

/**
 * Removes existing TMW chatbot elements from the DOM
 */
export const cleanupExistingChatbotElements = (): void => {
  // Remove any TMW chatbot scripts
  const existingScripts = document.querySelectorAll('[id^="tmw-chatbot"]');
  existingScripts.forEach(script => {
    try {
      script.parentNode?.removeChild(script);
    } catch (err) {
      console.error("Error removing existing chatbot script:", err);
    }
  });
  
  // Remove any existing chatbot iframe elements
  const existingIframes = document.querySelectorAll('iframe[src*="tmw"], iframe[id*="tmw"]');
  existingIframes.forEach(iframe => {
    try {
      iframe.parentNode?.removeChild(iframe);
    } catch (err) {
      console.error("Error removing existing chatbot iframe:", err);
    }
  });
  
  // Remove any div elements that might have been created for the chatbot
  const chatbotDivs = document.querySelectorAll('div[id*="tmw-chatbot-content"]');
  chatbotDivs.forEach(div => {
    try {
      div.parentNode?.removeChild(div);
    } catch (err) {
      console.error("Error removing chatbot div:", err);
    }
  });
  
  // Don't remove containers, just clean their contents
  const containers = document.querySelectorAll('div[id^="tmw-chatbot-container"]');
  containers.forEach(container => {
    try {
      container.innerHTML = '';
    } catch (err) {
      console.error("Error clearing chatbot container:", err);
    }
  });
};
