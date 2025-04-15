
import React from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  onClearChat: () => void;
  hasMessages: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, hasMessages }) => {
  const { currentPersonality } = useAIPersonality();
  
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center",
          currentPersonality.color
        )}>
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium flex items-center gap-1.5">
            {currentPersonality.title}
            <Badge variant="outline" className="ml-1 text-[10px] h-4 bg-muted/30">
              v2.0
            </Badge>
          </h3>
          <p className="text-xs text-muted-foreground">{currentPersonality.description}</p>
        </div>
      </div>
      
      {hasMessages && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="h-7 w-7 hover:bg-red-50 hover:text-red-500 transition-colors"
          aria-label="Clear chat"
          title="Clear chat"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
