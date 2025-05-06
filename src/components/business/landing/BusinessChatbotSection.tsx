
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
  
  // Use the updated TMW chatbot hook
  const { initChatbot } = useTMWChatbot();
  
  // Initialize the chatbot when the component loads
  useEffect(() => {
    console.log("BusinessChatbotSection mounting with:", {
      enabled,
      containerId,
      codeLength: chatbot_code?.length || 0,
      size: chatbot_size,
      backgroundPattern: background_pattern
    });
    
    // Initialize the chatbot
    const cleanup = initChatbot(enabled, chatbot_code || "", containerId);
    
    return () => {
      console.log("BusinessChatbotSection unmounting:", containerId);
      if (cleanup) cleanup();
    };
  }, [enabled, chatbot_code, containerId, chatbot_size, background_pattern, initChatbot]);
  
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
  
  // Get the background pattern style based on the pattern value
  const getPatternStyle = () => {
    if (!background_pattern || background_pattern === 'none') {
      return {};
    }
    
    // Use the same pattern generation logic as in PageBackground.tsx
    let backgroundPatternValue = 'none';
    
    if (background_pattern === 'dots') {
      backgroundPatternValue = 'radial-gradient(#00000022 1px, transparent 1px)';
    } else if (background_pattern === 'grid') {
      backgroundPatternValue = 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)';
    } else if (background_pattern === 'waves') {
      backgroundPatternValue = 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")';
    } else if (background_pattern === 'diagonal') {
      backgroundPatternValue = 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)';
    } else if (background_pattern === 'circles') {
      backgroundPatternValue = 'radial-gradient(circle, #00000011 10px, transparent 11px)';
    } else if (background_pattern === 'triangles') {
      backgroundPatternValue = 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0 L 30 52 L 60 0 Z" fill="%2300000011"/%3E%3C/svg%3E")';
    } else if (background_pattern === 'hexagons') {
      backgroundPatternValue = 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 15 L 15 0 L 45 0 L 60 15 L 60 45 L 45 60 L 15 60 L 0 45 Z" fill="%2300000011"/%3E%3C/svg%3E")';
    } else if (background_pattern === 'stripes') {
      backgroundPatternValue = 'repeating-linear-gradient(90deg, #00000011, #00000011 5px, transparent 5px, transparent 15px)';
    } else if (background_pattern === 'zigzag') {
      backgroundPatternValue = 'linear-gradient(135deg, #00000011 25%, transparent 25%) 0 0, linear-gradient(225deg, #00000011 25%, transparent 25%) 0 0';
    } else if (background_pattern === 'confetti') {
      backgroundPatternValue = 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="10" y="10" width="4" height="4" transform="rotate(45 12 12)" fill="%2300000022"/%3E%3Crect x="30" y="20" width="4" height="4" transform="rotate(30 32 22)" fill="%2300000022"/%3E%3Crect x="15" y="40" width="4" height="4" transform="rotate(60 17 42)" fill="%2300000022"/%3E%3Crect x="40" y="45" width="4" height="4" transform="rotate(12 42 47)" fill="%2300000022"/%3E%3C/svg%3E")';
    } else if (background_pattern === 'bubbles') {
      backgroundPatternValue = 'radial-gradient(circle at 25px 25px, #00000011 15px, transparent 16px), radial-gradient(circle at 75px 75px, #00000011 15px, transparent 16px)';
    }
      
    return {
      backgroundImage: backgroundPatternValue,
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat'
    };
  };
  
  const patternStyle = getPatternStyle();
  
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
        style={patternStyle}
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
