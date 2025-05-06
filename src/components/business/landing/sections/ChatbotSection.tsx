
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import BusinessChatbotSection from "../BusinessChatbotSection";

interface ChatbotSectionProps {
  section: BusinessPageSection;
  businessId: string;
}

const ChatbotSection: React.FC<ChatbotSectionProps> = ({ section, businessId }) => {
  const content = section.section_content || {};
  
  return (
    <div className="py-8 md:py-12">
      <BusinessChatbotSection content={content} />
    </div>
  );
};

export default ChatbotSection;
