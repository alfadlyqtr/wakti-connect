import { useEffect, useRef } from "react";

// Define a hook to handle TMW chatbot functionality
export const useTMWChatbot = () => {
  const chatbotRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    console.log("TMW Chatbot hook initialized");
    return () => {
      console.log("TMW Chatbot hook cleanup");
      if (chatbotRef.current) {
        try {
          const element = chatbotRef.current;
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        } catch (error) {
          console.error("Error cleaning up chatbot:", error);
        }
      }
    };
  }, []);

  // Method to initialize the chatbot in a container
  const initializeChatbot = (containerId: string, chatbotCode: string) => {
    if (!chatbotCode) {
      console.log("No chatbot code provided");
      return;
    }

    console.log("Initializing TMW chatbot in container:", containerId);
    const container = document.getElementById(containerId);
    if (!container) {
      console.error("Container not found:", containerId);
      return;
    }

    // Clean up any existing chatbot elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      // Determine if this is an iframe or script-based chatbot
      if (chatbotCode.includes('<iframe')) {
        // Handle iframe-based chatbot
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = chatbotCode.trim();
        const iframe = tempDiv.querySelector('iframe');
        
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          container.appendChild(iframe);
          chatbotRef.current = iframe;
        } else {
          console.error("Could not extract iframe from chatbot code");
        }
      } else if (chatbotCode.includes('<script')) {
        // Handle script-based chatbot
        const script = document.createElement('script');
        
        // Extract src from the code if present
        const srcMatch = chatbotCode.match(/src=["']([^"']*)["']/);
        if (srcMatch && srcMatch[1]) {
          script.src = srcMatch[1];
        } else {
          // Otherwise, try to extract the inline script content
          const scriptContent = chatbotCode
            .replace(/<script[^>]*>/, '')
            .replace(/<\/script>/, '');
          script.textContent = scriptContent;
        }
        
        // Add the script to the document
        document.head.appendChild(script);
        chatbotRef.current = script;
      } else {
        console.error("Unrecognized chatbot code format");
      }
    } catch (error) {
      console.error("Error initializing chatbot:", error);
    }
  };

  return { chatbotRef, initializeChatbot };
};
