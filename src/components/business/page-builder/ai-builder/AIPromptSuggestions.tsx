
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Phone, 
  Image, 
  MessageSquare, 
  Instagram, 
  Star, 
  Bot 
} from "lucide-react";

interface AIPromptSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const AIPromptSuggestions: React.FC<AIPromptSuggestionsProps> = ({ onSelectSuggestion }) => {
  const suggestions = [
    {
      icon: <Calendar className="h-3 w-3" />,
      text: "Add a booking system",
    },
    {
      icon: <Phone className="h-3 w-3" />,
      text: "Add a contact form",
    },
    {
      icon: <Image className="h-3 w-3" />,
      text: "Add a photo gallery",
    },
    {
      icon: <MessageSquare className="h-3 w-3" />,
      text: "Add testimonials",
    },
    {
      icon: <Instagram className="h-3 w-3" />,
      text: "Add Instagram feed",
    },
    {
      icon: <Star className="h-3 w-3" />,
      text: "Add about us section",
    },
    {
      icon: <Bot className="h-3 w-3" />,
      text: "Add TMW AI chatbot",
    },
  ];

  return (
    <div className="pt-2">
      <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex gap-2 w-max">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 h-7 text-xs"
              onClick={() => onSelectSuggestion(suggestion.text)}
            >
              {suggestion.icon}
              {suggestion.text}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AIPromptSuggestions;
