
import React, { useEffect } from "react";
import { useTMWChatbot } from "@/hooks/tmw-chatbot";
import { ExternalLink } from "lucide-react";

interface BusinessChatbotSectionProps {
  content: {
    enabled?: boolean;
    section_title?: string;
    section_description?: string;
    chatbot_code?: string;
    chatbot_size?: 'small' | 'medium' | 'large' | 'full';
    background_pattern?: string;
  };
}

const BusinessChatbotSection: React.FC<BusinessChatbotSectionProps> = ({ content }) => {
  const {
    enabled = true,
    section_title = "Chat with Us",
    section_description = "",
    chatbot_code = "",
    chatbot_size = "medium",
    background_pattern = "none"
  } = content;
  
  // Create a unique ID for this chatbot container
  const containerId = `tmw-chatbot-section-${Math.floor(Math.random() * 10000)}`;
  
  // Use the TMW chatbot hook
  const chatbotRef = useTMWChatbot(enabled, chatbot_code, containerId);
  
  // Log the chatbot setup for debugging
  useEffect(() => {
    console.log("BusinessChatbotSection mounting with:", {
      enabled,
      containerId,
      codeLength: chatbot_code?.length || 0,
      size: chatbot_size,
      backgroundPattern: background_pattern
    });
    
    return () => {
      console.log("BusinessChatbotSection unmounting:", containerId);
    };
  }, [enabled, chatbot_code, containerId, chatbot_size, background_pattern]);
  
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
  
  if (!enabled) {
    return null;
  }
  
  return (
    <div className="w-full">
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
        {/* The chatbot will be injected here by the hook */}
      </div>
      
      {/* Add the "Powered by TMW AI" attribution */}
      <div className="mt-3 text-center text-sm text-muted-foreground">
        <a 
          href="https://tmw.qa/ai-chat-bot/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:underline"
        >
          Powered by TMW AI <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default BusinessChatbotSection;
