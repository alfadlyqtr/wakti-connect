
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SuggestionPromptsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  isLoading: boolean;
}

export const SuggestionPrompts = ({
  suggestions,
  onSelectSuggestion,
  isLoading,
}: SuggestionPromptsProps) => {
  return (
    <Alert className="bg-muted/50 p-3 sm:p-4">
      <AlertTitle className="text-xs sm:text-sm font-medium mb-2">Try asking:</AlertTitle>
      <AlertDescription>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1 px-2"
              onClick={() => onSelectSuggestion(suggestion)}
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};
