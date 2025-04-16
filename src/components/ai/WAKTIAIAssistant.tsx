
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
        background: "radial-gradient(circle at 10% 20%, rgba(0, 10, 30, 0.9) 0%, rgba(0, 12, 45, 0.95) 90%)",
        boxShadow: "inset 0 0 100px rgba(20, 50, 100, 0.2)",
        minHeight: '100vh'
      }}
    >
      <div className="container max-w-5xl mx-auto px-4">
        <div 
          className="w-full rounded-2xl overflow-hidden transform hover:translate-y-[-12px] transition-all duration-500"
          style={{
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(59, 130, 246, 0.3)',
            transform: 'perspective(1500px) rotateX(2deg)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          <UnifiedChatInterfaceWithProvider />
        </div>
      </div>
    </div>
  );
};

export default WAKTIAIAssistant;
