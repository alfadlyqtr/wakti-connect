
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      
      <Card className="overflow-hidden border-primary/10">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5">
          <CardHeader className="p-0 pb-5">
            <CardTitle className="flex items-center gap-2 text-primary">
              <InfoIcon className="h-5 w-5" />
              Need an AI Chatbot for your business?
            </CardTitle>
            <CardDescription className="mt-2 text-base text-muted-foreground">
              Get a powerful AI chatbot from TMW that can answer customer questions, assist with bookings, and provide 24/7 support.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Answer customer questions instantly, 24/7</li>
              <li>Reduce support workload by automating common inquiries</li>
              <li>Boost conversions with real-time assistance</li>
              <li>Seamlessly integrate with your WAKTI business page</li>
            </ul>
            
            <div className="space-y-3">
              <a 
                href="https://tmw.qa/ai-chat-bot/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline font-medium"
              >
                Learn more about TMW AI Chatbots <ExternalLink className="ml-1 h-4 w-4" />
              </a>
              
              <Button onClick={handleAddChatbotSection} className="w-full mt-3">
                Go to Sections Tab to Add Chatbot
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotSettings;
