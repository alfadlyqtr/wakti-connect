
import React from "react";
import { Bot, RefreshCcw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantChat } from "./AIAssistantChat";
import { SuggestionPrompts } from "./SuggestionPrompts";
import { AIMessage } from "@/types/ai-assistant.types";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const suggestionQuestions = [
    "What tasks should I prioritize today?",
    "Help me plan an event",
    "Analyze my team's performance",
    "Optimize my schedule",
    "Improve task completion"
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Bot className="h-4 w-4 md:h-5 md:w-5 text-wakti-blue" />
          Chat with WAKTI AI
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
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
      <CardFooter className="flex flex-col pt-3 md:pt-6">
        <div className="flex justify-between w-full mb-2 md:mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearMessages}
            className="text-xs py-1 px-2 h-auto md:py-1.5 md:px-3"
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            {isMobile ? "New chat" : "New conversation"}
          </Button>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span className="hidden xs:inline">Powered by</span> <a 
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
          suggestions={isMobile ? suggestionQuestions.slice(0, 3) : suggestionQuestions}
          onSelectSuggestion={setInputMessage}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};
