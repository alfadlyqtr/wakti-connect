
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIAssistantChatCard } from '../AIAssistantChatCard';
import { vi } from 'vitest';
import { AIAssistantRole } from '@/types/ai-assistant.types';

// Mock child components
vi.mock('../AIAssistantChat', () => ({
  AIAssistantChat: () => <div data-testid="mock-assistant-chat">AIAssistantChat</div>,
}));

vi.mock('../MessageInputForm', () => ({
  MessageInputForm: () => <div data-testid="mock-message-form">MessageInputForm</div>,
}));

vi.mock('../EmptyStateView', () => ({
  EmptyStateView: ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => (
    <button data-testid="mock-prompt-button" onClick={() => onPromptClick('Test prompt')}>
      Prompt
    </button>
  ),
}));

vi.mock('../PoweredByTMW', () => ({
  PoweredByTMW: () => <div data-testid="mock-powered-by">PoweredByTMW</div>,
}));

vi.mock('../AIRoleSelector', () => ({
  AIRoleSelector: () => <div data-testid="mock-role-selector">AIRoleSelector</div>,
}));

describe('AIAssistantChatCard', () => {
  const mockSetInputMessage = vi.fn();
  const mockHandleSendMessage = vi.fn();
  const mockClearMessages = vi.fn();
  const mockOnRoleChange = vi.fn();
  const selectedRole: AIAssistantRole = 'general';

  it('renders empty state when no messages', () => {
    render(
      <AIAssistantChatCard
        messages={[]}
        inputMessage=""
        setInputMessage={mockSetInputMessage}
        handleSendMessage={mockHandleSendMessage}
        isLoading={false}
        canAccess={true}
        clearMessages={mockClearMessages}
        selectedRole={selectedRole}
        onRoleChange={mockOnRoleChange}
      />
    );
    
    expect(screen.getByTestId('mock-prompt-button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-message-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-powered-by')).toBeInTheDocument();
  });

  it('sets input message when prompt is clicked', () => {
    render(
      <AIAssistantChatCard
        messages={[]}
        inputMessage=""
        setInputMessage={mockSetInputMessage}
        handleSendMessage={mockHandleSendMessage}
        isLoading={false}
        canAccess={true}
        clearMessages={mockClearMessages}
        selectedRole={selectedRole}
        onRoleChange={mockOnRoleChange}
      />
    );
    
    fireEvent.click(screen.getByTestId('mock-prompt-button'));
    expect(mockSetInputMessage).toHaveBeenCalledWith('Test prompt');
  });
});
