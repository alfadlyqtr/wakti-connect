
import React from "react";
import { Bot, RefreshCcw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantChat } from "./AIAssistantChat";
import { SuggestionPrompts } from "./SuggestionPrompts";
import { AIMessage } from "@/types/ai-assistant.types";

interface AIAssistantChatCardProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
}

export const AIAssistantChatCard = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages,
}: AIAssistantChatCardProps) => {
  const suggestionQuestions = [
    "What tasks should I prioritize today?",
    "Help me plan an event for next week",
    "Analyze my team's performance",
    "Optimize my work schedule",
    "Suggest ways to improve task completion rate"
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          Chat with WAKTI AI
        </CardTitle>
        <CardDescription>
          Ask about tasks, events, staff management, analytics, and more
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <AIAssistantChat
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
        />
      </CardContent>
      <CardFooter className="flex flex-col pt-6">
        <div className="flex justify-between w-full mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearMessages}
            className="text-xs"
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            New conversation
          </Button>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Powered by <a 
              href="https://tmw.qa/ai-chat-bot/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-wakti-blue hover:underline ml-1"
            >
              TMW AI
            </a>
          </div>
        </div>
        
        <SuggestionPrompts
          suggestions={suggestionQuestions}
          onSelectSuggestion={setInputMessage}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};
