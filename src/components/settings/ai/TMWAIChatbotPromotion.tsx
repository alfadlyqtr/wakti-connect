
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare } from "lucide-react";

export const TMWAIChatbotPromotion: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-wakti-blue to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          TMW AI Chatbot Integration
        </CardTitle>
        <CardDescription className="text-gray-100">
          Enhance your WAKTI experience with powerful AI chatbot capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p>
          Connect your WAKTI account with the TMW AI Chatbot to unlock advanced conversational AI capabilities and knowledge management features.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Knowledge Management</h3>
            <p className="text-sm text-muted-foreground">
              Upload documents, transcripts and custom knowledge to train your AI assistant.
            </p>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Custom Training</h3>
            <p className="text-sm text-muted-foreground">
              Teach your AI assistant about your business, services, and specific workflows.
            </p>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Embeddable Chat Widget</h3>
            <p className="text-sm text-muted-foreground">
              Add an AI assistant to your website to engage with visitors and answer questions.
            </p>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Advanced Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Get insights into customer interactions and questions to improve your services.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          variant="default"
          onClick={() => window.open("https://tmw.qa", "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Learn More About TMW AI Integration
        </Button>
      </CardFooter>
    </Card>
  );
};
