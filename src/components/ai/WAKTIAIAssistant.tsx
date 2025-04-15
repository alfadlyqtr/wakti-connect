
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
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))',
        minHeight: '100vh'
      }}
    >
      <div className="container max-w-5xl mx-auto px-4">
        <div 
          className="w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transform hover:translate-y-[-5px] transition-all duration-300"
          style={{
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 50px 0 rgba(8, 112, 184, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
            transform: 'perspective(1000px) rotateX(1deg)'
          }}
        >
          <UnifiedChatInterfaceWithProvider />
        </div>
      </div>
    </div>
  );
};

export default WAKTIAIAssistant;
