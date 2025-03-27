
import React from "react";
import { ExternalLink } from "lucide-react";

export const PoweredByTMW: React.FC = () => {
  return (
    <div className="flex justify-center p-2 text-xs text-muted-foreground border-t">
      <a 
        href="https://tmw.qa" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center hover:text-wakti-blue transition-colors"
      >
        Powered by TMW 
        <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    </div>
  );
};
