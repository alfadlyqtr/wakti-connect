
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bot } from "lucide-react";

export const TMWAIChatbotPromotion: React.FC = () => {
  return (
    <Card className="border-blue-200 mt-4">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base text-blue-900">
          <Bot className="h-5 w-5 text-wakti-blue" />
          Need broader AI capabilities?
        </CardTitle>
        <CardDescription className="text-blue-700 text-xs md:text-sm">
          Try TMW AI Chatbot for your business
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <p className="text-xs md:text-sm text-muted-foreground mb-3">
          TMW AI Chatbot offers enterprise-grade conversational AI for your business website, 
          social media, and customer service needs.
        </p>
        <Button 
          className="w-full text-xs md:text-sm py-1 md:py-2 h-auto"
          size="sm"
          variant="outline"
          onClick={() => window.open("https://tmw.qa/ai-chat-bot/", "_blank")}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Learn more at tmw.qa
        </Button>
      </CardContent>
    </Card>
  );
};
