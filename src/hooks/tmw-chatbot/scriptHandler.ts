
/**
 * Handles the injection of script-based TMW chatbots
 */
export const injectScriptChatbot = (
  chatbotCode: string, 
  targetElementId: string = 'tmw-chatbot-container'
): HTMLScriptElement | null => {
  // Find the target container
  const targetContainer = document.getElementById(targetElementId);
  
  if (!targetContainer) {
    console.error(`Target container #${targetElementId} not found for TMW chatbot`);
    return null;
  }
  
  // Ensure the container has sufficient height to display the chatbot
  if (targetContainer.clientHeight < 300) {
    targetContainer.style.minHeight = '300px';
  }
  
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
    targetElementId,
    containerHeight: targetContainer.clientHeight
  });
  
  // Clear previous content
  targetContainer.innerHTML = '';
  
  try {
    // Create a new script element
    const script = document.createElement('script');
    script.id = 'tmw-chatbot-script-' + Date.now(); // Unique ID to avoid conflicts
    
    // Handle different script scenarios
    if (scriptSrc) {
      // Case 1: External script with src attribute
      script.src = scriptSrc;
      console.log('TMW AI Chatbot: Adding external script with src:', scriptSrc);
      document.head.appendChild(script);
      return script;
    } else if (scriptContent) {
      // Case 2: Only inline content
      script.textContent = scriptContent;
      console.log('TMW AI Chatbot: Adding inline script with content length:', scriptContent.length);
      document.head.appendChild(script);
      return script;
    } else {
      console.error('TMW AI Chatbot: No valid script content or src found in:', chatbotCode);
      return null;
    }
  } catch (error) {
    console.error('Error injecting TMW AI Chatbot script:', error);
    return null;
  }
};
