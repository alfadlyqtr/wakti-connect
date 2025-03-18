
import React from "react";
import { Loader2 } from "lucide-react";

export const AIAssistantLoader = () => {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
    </div>
  );
};
