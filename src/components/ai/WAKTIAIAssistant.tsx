
import React from 'react';
import { UnifiedChatInterfaceWithProvider } from './chat/UnifiedChatInterface';

interface WAKTIAIAssistantProps {
  isFullscreen?: boolean;
  className?: string;
}

const WAKTIAIAssistant: React.FC<WAKTIAIAssistantProps> = ({ 
  isFullscreen = false,
  className = '' 
}) => {
  return (
    <div 
      className={`w-full h-full flex items-center justify-center py-2 sm:py-6 ${className}`}
      style={{
        background: 'transparent',
        minHeight: 'calc(100vh - 60px)'
      }}
    >
      <div className="container px-1 sm:px-4 mx-auto w-[95%] sm:max-w-5xl lg:max-w-6xl">
        <div 
          className="w-full rounded-xl sm:rounded-2xl overflow-hidden transform hover:translate-y-[-8px] transition-all duration-500"
          style={{
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            boxShadow: '0 15px 50px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(59, 130, 246, 0.3)',
            transform: 'perspective(1500px) rotateX(1deg)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        >
          <UnifiedChatInterfaceWithProvider />
        </div>
      </div>
    </div>
  );
};

export default WAKTIAIAssistant;
