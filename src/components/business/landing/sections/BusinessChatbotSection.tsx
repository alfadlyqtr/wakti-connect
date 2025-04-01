
import React, { useEffect, useRef } from "react";
import { useTMWChatbot } from "@/hooks/tmw-chatbot";

interface BusinessChatbotSectionProps {
  content: {
    enabled?: boolean;
    section_title?: string;
    section_description?: string;
    chatbot_code?: string;
    chatbot_size?: 'small' | 'medium' | 'large' | 'full';
  };
}

const BusinessChatbotSection: React.FC<BusinessChatbotSectionProps> = ({ content }) => {
  const {
    enabled = true,
    section_title = "Chat with Us",
    section_description = "",
    chatbot_code = "",
    chatbot_size = "medium"
  } = content;
  
  // Create a unique ID for this chatbot container
  const containerId = `tmw-chatbot-section-${Math.floor(Math.random() * 10000)}`;
  
  // Use the TMW chatbot hook
  useTMWChatbot(enabled, chatbot_code, containerId);
  
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
  
  if (!enabled || !chatbot_code) {
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
        {/* The chatbot will be injected here by the hook */}
      </div>
    </div>
  );
};

export default BusinessChatbotSection;
