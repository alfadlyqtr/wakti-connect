
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
  
  // Remove any existing chatbot containers
  const chatbotContainers = document.querySelectorAll('.tmw-chat-container, .tmw-chatbot-container');
  chatbotContainers.forEach(container => {
    try {
      container.parentNode?.removeChild(container);
    } catch (err) {
      console.error("Error removing chatbot container:", err);
    }
  });
};
