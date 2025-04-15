
import React from 'react';
import { UnifiedChatInterfaceWithProvider } from './chat/UnifiedChatInterface';

interface WAKTIAIAssistantProps {
  isFullscreen?: boolean;
}

const WAKTIAIAssistant: React.FC<WAKTIAIAssistantProps> = ({ isFullscreen = false }) => {
  return <UnifiedChatInterfaceWithProvider />;
};

export default WAKTIAIAssistant;
