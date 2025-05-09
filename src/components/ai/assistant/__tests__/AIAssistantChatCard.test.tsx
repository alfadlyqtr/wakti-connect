
import React from 'react';
import { render } from '@testing-library/react';
import { AIAssistantChatCard } from '../AIAssistantChatCard';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import '@testing-library/jest-dom'; // Add this to bring in toBeInTheDocument matcher

// Mock AIRoleSelector
vi.mock('../AIRoleSelector', () => ({
  AIRoleSelector: () => <div data-testid="mock-role-selector">Role Selector</div>
}));

// Mock AIAssistantChat
vi.mock('../AIAssistantChat', () => ({
  AIAssistantChat: () => <div data-testid="mock-assistant-chat">Chat Content</div>
}));

// Mock EmptyStateView
vi.mock('../EmptyStateView', () => ({
  EmptyStateView: ({ onPromptClick }) => (
    <div data-testid="mock-empty-state">
      <button onClick={() => onPromptClick('Test prompt')}>Use prompt</button>
    </div>
  )
}));

// Mock MessageInputForm
vi.mock('../MessageInputForm', () => ({
  MessageInputForm: () => <div data-testid="mock-message-input">Message Input</div>
}));

// Mock PoweredByTMW
vi.mock('../PoweredByTMW', () => ({
  PoweredByTMW: () => <div data-testid="mock-powered-by">Powered By TMW</div>
}));

describe('AIAssistantChatCard', () => {
  const mockSetInputMessage = vi.fn();
  const mockHandleSendMessage = vi.fn();
  const mockClearMessages = vi.fn();
  const mockOnRoleChange = vi.fn();
  
  const defaultProps = {
    messages: [] as AIMessage[],
    inputMessage: '',
    setInputMessage: mockSetInputMessage,
    handleSendMessage: mockHandleSendMessage,
    isLoading: false,
    canAccess: true,
    clearMessages: mockClearMessages,
    selectedRole: 'general' as AIAssistantRole,
    onRoleChange: mockOnRoleChange
  };
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders empty state when no messages', () => {
    const { getByTestId } = render(<AIAssistantChatCard {...defaultProps} />);
    
    expect(getByTestId('mock-empty-state')).toBeInTheDocument();
    expect(getByTestId('mock-role-selector')).toBeInTheDocument();
    expect(getByTestId('mock-message-input')).toBeInTheDocument();
    expect(getByTestId('mock-powered-by')).toBeInTheDocument();
  });
  
  it('renders chat when messages exist', () => {
    const props = {
      ...defaultProps,
      messages: [{ id: '1', role: 'assistant' as const, content: 'Hello', timestamp: new Date() }],
    };
    
    const { getByTestId, queryByTestId } = render(<AIAssistantChatCard {...props} />);
    
    expect(getByTestId('mock-assistant-chat')).toBeInTheDocument();
    expect(queryByTestId('mock-empty-state')).not.toBeInTheDocument();
  });
  
  it('calls setInputMessage when prompt is clicked', () => {
    const { getByText } = render(<AIAssistantChatCard {...defaultProps} />);
    
    getByText('Use prompt').click();
    
    expect(mockSetInputMessage).toHaveBeenCalledWith('Test prompt');
  });
  
  it('shows clear button when messages exist', () => {
    const props = {
      ...defaultProps,
      messages: [{ id: '1', role: 'assistant' as const, content: 'Hello', timestamp: new Date() }],
    };
    
    const { getByTitle } = render(<AIAssistantChatCard {...props} />);
    
    expect(getByTitle('Clear chat')).toBeInTheDocument();
  });
  
  it('calls clearMessages when clear button is clicked', () => {
    const props = {
      ...defaultProps,
      messages: [{ id: '1', role: 'assistant' as const, content: 'Hello', timestamp: new Date() }],
    };
    
    const { getByTitle } = render(<AIAssistantChatCard {...props} />);
    
    getByTitle('Clear chat').click();
    
    expect(mockClearMessages).toHaveBeenCalled();
  });
});
