
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Removed props since they're not being used anymore
const ChatbotCard: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddChatbotSection = () => {
    // Navigate to the sections tab
    navigate('/dashboard/business-page/sections');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>TMW AI Chatbot</CardTitle>
        <CardDescription>
          Integrate the TMW AI Chatbot with your business page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>The chatbot integration has been updated</AlertTitle>
          <AlertDescription>
            The TMW AI Chatbot is now available as a dedicated section that you can add to your page.
            This gives you more flexibility to place it anywhere on your page.
          </AlertDescription>
        </Alert>
        
        <Button onClick={handleAddChatbotSection}>
          Add Chatbot Section
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChatbotCard;
