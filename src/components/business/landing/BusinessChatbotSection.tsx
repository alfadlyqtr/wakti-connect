
import React from "react";
import { ExternalLink } from "lucide-react";

interface BusinessChatbotSectionProps {
  content: Record<string, any>;
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
  
  // Log the chatbot setup for debugging
  React.useEffect(() => {
    console.log("BusinessChatbotSection mounting with:", {
      enabled,
      containerId,
      codeLength: chatbot_code?.length || 0,
      size: chatbot_size,
      backgroundPattern: background_pattern
    });
    
    // Inject the chatbot script if provided
    if (chatbot_code && typeof window !== 'undefined') {
      try {
        // Create a script element
        const script = document.createElement('script');
        script.innerHTML = chatbot_code;
        
        // Append it to the container
        const container = document.getElementById(containerId);
        if (container) {
          container.appendChild(script);
        }
      } catch (err) {
        console.error("Error injecting chatbot script:", err);
      }
    }
    
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
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
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
              <p className="text-muted-foreground">Add your chatbot code to enable the chatbot</p>
            </div>
          )}
        </div>
        
        {/* Add the "Powered by" attribution if needed */}
        <div className="mt-3 text-center text-sm text-muted-foreground">
          <span className="inline-flex items-center">
            Powered by AI Chatbot <ExternalLink className="ml-1 h-3 w-3" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default BusinessChatbotSection;
