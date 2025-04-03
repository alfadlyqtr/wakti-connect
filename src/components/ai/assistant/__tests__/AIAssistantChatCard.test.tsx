
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIAssistantChatCard } from '../AIAssistantChatCard';
import { vi } from 'vitest';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';

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
    render(<AIAssistantChatCard {...defaultProps} />);
    
    expect(screen.getByTestId('mock-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('mock-role-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-message-input')).toBeInTheDocument();
    expect(screen.getByTestId('mock-powered-by')).toBeInTheDocument();
  });
  
  it('renders chat when messages exist', () => {
    const props = {
      ...defaultProps,
      messages: [{ id: '1', role: 'assistant' as const, content: 'Hello', timestamp: new Date() }],
    };
    
    render(<AIAssistantChatCard {...props} />);
    
    expect(screen.getByTestId('mock-assistant-chat')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-empty-state')).not.toBeInTheDocument();
  });
  
  it('calls setInputMessage when prompt is clicked', () => {
    render(<AIAssistantChatCard {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Use prompt'));
    
    expect(mockSetInputMessage).toHaveBeenCalledWith('Test prompt');
  });
  
  it('shows clear button when messages exist', () => {
    const props = {
      ...defaultProps,
      messages: [{ id: '1', role: 'assistant' as const, content: 'Hello', timestamp: new Date() }],
    };
    
    render(<AIAssistantChatCard {...props} />);
    
    expect(screen.getByTitle('Clear chat')).toBeInTheDocument();
  });
  
  it('calls clearMessages when clear button is clicked', () => {
    const props = {
      ...defaultProps,
      messages: [{ id: '1', role: 'assistant' as const, content: 'Hello', timestamp: new Date() }],
    };
    
    render(<AIAssistantChatCard {...props} />);
    
    fireEvent.click(screen.getByTitle('Clear chat'));
    
    expect(mockClearMessages).toHaveBeenCalled();
  });
});
