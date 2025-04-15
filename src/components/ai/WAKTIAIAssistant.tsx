
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
      className={`w-full h-full flex items-center justify-center py-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.9))',
        minHeight: '100vh'
      }}
    >
      <div className="container max-w-5xl mx-auto px-4">
        <div 
          className="w-full rounded-2xl overflow-hidden transform hover:translate-y-[-8px] transition-all duration-500"
          style={{
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            boxShadow: '0 25px 70px 0 rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(59, 130, 246, 0.3)',
            transform: 'perspective(1500px) rotateX(2deg)',
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
