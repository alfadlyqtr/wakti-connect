
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";

export const ChatbotPreview = () => {
  const { pageData } = useBusinessPage();
  const { position, embedCode } = pageData.chatbot;
  
  // If no embed code, show a placeholder
  if (!embedCode) {
    const positionClass = position === "left" ? "left-4" : "right-4";
    
    return (
      <div 
        className={`fixed bottom-4 ${positionClass} bg-primary text-primary-foreground p-3 rounded-full shadow-lg`}
        style={{ zIndex: 1000 }}
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <span className="text-sm">AI</span>
        </div>
      </div>
    );
  }
  
  // In a real implementation, we would render the embed code here
  // For preview purposes, we'll just show a placeholder
  const positionClass = position === "left" ? "left-4" : "right-4";
  
  return (
    <div 
      className={`fixed bottom-4 ${positionClass} bg-primary text-primary-foreground p-3 rounded-full shadow-lg`}
      style={{ zIndex: 1000 }}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <span className="text-sm">TMW</span>
      </div>
    </div>
  );
};
