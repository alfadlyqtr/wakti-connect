
import React from 'react';
import { Bot } from 'lucide-react';

export const PoweredByTMW = () => {
  return (
    <div className="text-center py-2 text-xs text-muted-foreground border-t">
      <a 
        href="https://tmw.qa" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
      >
        Powered by <span className="font-medium">TMW</span> 
        <Bot className="h-3 w-3" />
      </a>
    </div>
  );
};
