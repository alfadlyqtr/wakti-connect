
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AIAssistantChatCard } from '../AIAssistantChatCard';

// Mock the dependencies
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.join(' '),
}));

vi.mock('@/hooks/ai/useAIChat', () => ({
  useAIChat: () => ({
    sendMessage: vi.fn(),
    messages: [],
    isLoading: false,
  }),
}));

describe('AIAssistantChatCard', () => {
  it('renders correctly', () => {
    render(
      <AIAssistantChatCard 
        messages={[]}
        inputMessage=""
        setInputMessage={() => {}}
        handleSendMessage={async () => {}}
        isLoading={false}
        canAccess={true}
        clearMessages={() => {}}
      />
    );
    // Example assertions - update these based on your implementation
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
  });
});
