
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ChatbotSettings: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddChatbotSection = () => {
    // Navigate to the sections tab
    navigate('/dashboard/business-page/sections');
  };
  
  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>The chatbot integration has been updated</AlertTitle>
        <AlertDescription>
          The TMW AI Chatbot is now available as a dedicated section that you can add to your page.
          This gives you more flexibility to place it anywhere on your page.
        </AlertDescription>
      </Alert>
      
      <Button onClick={handleAddChatbotSection} className="w-full">
        Go to Sections Tab to Add Chatbot
      </Button>
    </div>
  );
};

export default ChatbotSettings;
