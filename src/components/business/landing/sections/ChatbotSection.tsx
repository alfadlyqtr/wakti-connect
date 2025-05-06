import React, { useEffect, useRef } from "react";
import { useTMWChatbot } from "@/hooks/tmw-chatbot";
import { BusinessPageSection } from "@/types/business.types";

interface ChatbotSectionProps {
  section: BusinessPageSection;
}

const ChatbotSection: React.FC<ChatbotSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  const containerId = `tmw-chatbot-${section.id}`;
  
  const { 
    enabled = true,
    chatbot_code = "",
    section_title = "Chat with Us",
    section_description = "",
    chatbot_size = "medium",
    background_pattern = "none"
  } = content;
  
  // Initialize the chatbot hook
  // Note: We're using the hook differently now - without parameters
  // The actual function implementation will handle the chatbot logic
  const chatbotRef = useRef(null);
  
  // Handle chatbot setup manually
  useEffect(() => {
    if (!enabled || !chatbot_code) {
      console.log("Chatbot disabled or no code provided");
      return;
    }
    
    console.log("Setting up TMW chatbot with code length:", chatbot_code.length);
    
    // Clean up any existing chatbot elements
    const container = document.getElementById(containerId);
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Determine if this is an iframe or script-based chatbot
      if (chatbot_code.includes('<iframe')) {
        // Handle iframe-based chatbot
        try {
          // Extract iframe HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = chatbot_code.trim();
          const iframe = tempDiv.querySelector('iframe');
          
          if (iframe) {
            // Set iframe to fill the container
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            container.appendChild(iframe);
            chatbotRef.current = iframe;
          } else {
            console.error("Could not extract iframe from chatbot code");
          }
        } catch (error) {
          console.error("Error adding iframe chatbot:", error);
        }
      } else if (chatbot_code.includes('<script')) {
        // Handle script-based chatbot
        try {
          const script = document.createElement('script');
          
          // Extract src from the code if present
          const srcMatch = chatbot_code.match(/src=["']([^"']*)["']/);
          if (srcMatch && srcMatch[1]) {
            script.src = srcMatch[1];
          } else {
            // Otherwise, try to extract the inline script content
            const scriptContent = chatbot_code
              .replace(/<script[^>]*>/, '')
              .replace(/<\/script>/, '');
            script.textContent = scriptContent;
          }
          
          // Add the script to the document
          document.head.appendChild(script);
          chatbotRef.current = script;
        } catch (error) {
          console.error("Error adding script chatbot:", error);
        }
      }
    }
    
    // Cleanup function
    return () => {
      if (chatbotRef.current) {
        try {
          const element = chatbotRef.current as HTMLElement;
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
          chatbotRef.current = null;
        } catch (error) {
          console.error("Error cleaning up chatbot:", error);
        }
      }
    };
  }, [containerId, enabled, chatbot_code]);
  
  if (!enabled) {
    return null;
  }
  
  const getSizeClasses = () => {
    switch (chatbot_size) {
      case 'small':
        return 'max-w-md mx-auto h-[400px]';
      case 'medium':
        return 'max-w-2xl mx-auto h-[500px]';
      case 'large':
        return 'max-w-4xl mx-auto h-[600px]';
      case 'full':
        return 'w-full h-[600px]';
      default:
        return 'max-w-2xl mx-auto h-[500px]';
    }
  };
  
  return (
    <div className="w-full py-8 mb-6">
      {(section_title || section_description) && (
        <div className="text-center mb-6">
          {section_title && <h2 className="text-2xl font-bold mb-2">{section_title}</h2>}
          {section_description && <p className="text-muted-foreground">{section_description}</p>}
        </div>
      )}
      
      <div 
        id={containerId}
        className={`relative border border-border rounded-md overflow-hidden ${getSizeClasses()}`}
      >
        {!chatbot_code && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Add your TMW AI Chatbot code to enable the chatbot</p>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-center text-sm text-muted-foreground">
        <a 
          href="https://tmw.qa/ai-chat-bot/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:underline"
        >
          Powered by TMW AI
        </a>
      </div>
    </div>
  );
};

export default ChatbotSection;
