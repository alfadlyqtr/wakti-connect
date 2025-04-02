
import React from "react";
import { Loader2, Bot } from "lucide-react";

export const AIAssistantLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-wakti-blue/10 flex items-center justify-center">
          <Bot className="h-8 w-8 text-wakti-blue opacity-70" />
        </div>
        <div className="absolute inset-0 border-t-2 border-wakti-blue rounded-full animate-spin"></div>
      </div>
      <p className="text-muted-foreground text-sm">Loading WAKTI AI Assistant...</p>
    </div>
  );
};
