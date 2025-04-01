
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatbotSettings from "./ChatbotSettings";

interface ChatbotCardProps {
  chatbotEnabled: boolean;
  chatbotCode: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({
  chatbotEnabled,
  chatbotCode,
  handleInputChange,
  handleToggleChange
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
          handleInputChange={handleInputChange}
          handleToggleChange={handleToggleChange}
        />
      </CardContent>
    </Card>
  );
};

export default ChatbotCard;
