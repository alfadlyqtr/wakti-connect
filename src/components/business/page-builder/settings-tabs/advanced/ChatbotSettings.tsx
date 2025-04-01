
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ExternalLink } from "lucide-react";
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
      
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-medium mb-2">Need an AI Chatbot for your business?</h3>
        <p className="text-muted-foreground mb-3">
          Get a powerful AI chatbot from TMW that can answer customer questions, assist with bookings, and provide 24/7 support.
        </p>
        <a 
          href="https://tmw.qa/ai-chat-bot/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-primary hover:underline font-medium"
        >
          Learn more about TMW AI Chatbots <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
      
      <Button onClick={handleAddChatbotSection} className="w-full">
        Go to Sections Tab to Add Chatbot
      </Button>
    </div>
  );
};

export default ChatbotSettings;
