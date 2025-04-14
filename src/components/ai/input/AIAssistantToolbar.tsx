
import React from 'react';
import { AIMessageInput } from './AIMessageInput';
import { WAKTIAIMode } from '@/types/ai-assistant.types';

interface AIAssistantToolbarProps {
  activeMode: WAKTIAIMode;
}

export const AIAssistantToolbar = ({ activeMode }: AIAssistantToolbarProps) => {
  return (
    <div className="p-3">
      <AIMessageInput activeMode={activeMode} />
    </div>
  );
};
