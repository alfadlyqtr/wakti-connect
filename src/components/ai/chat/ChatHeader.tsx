
import React from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  onClearChat?: () => void;
  hasMessages: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onClearChat,
  hasMessages 
}) => {
  const { currentPersonality, currentMode } = useAIPersonality();
  
  // Get header style based on mode
  const getHeaderStyle = () => {
    switch (currentMode) {
      case 'general':
        return 'from-blue-500 to-blue-600';
      case 'student':
        return 'from-green-500 to-green-600';
      case 'productivity':
        return 'from-purple-500 to-purple-600';
      case 'creative':
        return 'from-pink-500 via-purple-500 to-indigo-500';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };
  
  return (
    <motion.div 
      className={cn(
        "bg-gradient-to-r py-3 px-4 flex items-center justify-between border-b",
        getHeaderStyle()
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{currentPersonality.title}</h3>
          <p className="text-xs text-white/80">{currentPersonality.description}</p>
        </div>
      </div>
      
      {hasMessages && onClearChat && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClearChat}
          className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
};
