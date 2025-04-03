
import React from 'react';
import { ExternalLink } from 'lucide-react';

export const PoweredByTMW: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-wakti-blue/5 to-transparent border-t py-1.5 px-4 text-center flex items-center justify-center gap-1">
      <span className="text-xs text-muted-foreground">Powered by</span>
      <a 
        href="https://tmw.qa" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-wakti-blue hover:text-wakti-blue/80 font-medium flex items-center"
      >
        TMW.qa 
        <ExternalLink className="h-3 w-3 ml-0.5 inline-block" />
      </a>
    </div>
  );
};
