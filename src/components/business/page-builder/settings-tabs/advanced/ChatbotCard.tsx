
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatbotSettings from "./ChatbotSettings";

interface ChatbotCardProps {
  chatbotEnabled: boolean;
  chatbotCode: string;
  chatbotPosition?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSelectChange?: (name: string, value: string) => void;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({
  chatbotEnabled,
  chatbotCode,
  chatbotPosition,
  handleInputChange,
  handleToggleChange,
  handleSelectChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TMW AI Chatbot</CardTitle>
        <CardDescription>
          Integrate the TMW AI Chatbot with your business page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChatbotSettings 
          chatbotEnabled={chatbotEnabled}
          chatbotCode={chatbotCode}
          chatbotPosition={chatbotPosition}
          handleInputChange={handleInputChange}
          handleToggleChange={handleToggleChange}
          handleSelectChange={handleSelectChange}
        />
      </CardContent>
    </Card>
  );
};

export default ChatbotCard;
