
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
    <div className={`w-full h-full ${className}`} style={{ 
      background: 'linear-gradient(to right, #fdfcfb 0%, #e2d1c3 100%)',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div className="container mx-auto px-2 py-4 max-w-4xl">
        <UnifiedChatInterfaceWithProvider />
      </div>
    </div>
  );
};

export default WAKTIAIAssistant;
