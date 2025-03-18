
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
    <Alert className="bg-muted/50">
      <AlertTitle className="text-sm font-medium">Try asking:</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
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
