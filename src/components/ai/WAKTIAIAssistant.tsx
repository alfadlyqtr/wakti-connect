
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
        background: 'linear-gradient(135deg, rgba(238,174,202,0.4), rgba(148,187,233,0.3))',
        minHeight: '100vh'
      }}
    >
      <div className="container max-w-5xl mx-auto px-4">
        <div 
          className="w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20"
          style={{
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.16)'
          }}
        >
          <UnifiedChatInterfaceWithProvider />
        </div>
      </div>
    </div>
  );
};

export default WAKTIAIAssistant;
