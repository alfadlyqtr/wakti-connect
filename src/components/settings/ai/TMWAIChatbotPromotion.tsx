
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const TMWAIChatbotPromotion: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Your Knowledge Base with TMW AI</CardTitle>
        <CardDescription>
          WAKTI AI works well with its built-in knowledge, but for an even more powerful AI experience, 
          try the full-featured TMW AI Chatbot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p>TMW AI Chatbot offers:</p>
          <ul className="list-disc pl-5 pt-2 space-y-1">
            <li>Upload and process documents in various formats</li>
            <li>Train the AI on your specific data</li>
            <li>Create custom knowledge bases</li>
            <li>Advanced document interpretation</li>
            <li>Comprehensive PDF and content analysis</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => window.open("https://tmw.qa/ai-chat-bot/", "_blank")}>
          Visit TMW AI Chatbot <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
