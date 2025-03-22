
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'; // Add this import for the matchers
import { AIAssistantChatCard } from '../AIAssistantChatCard';
import { AISettingsProvider } from '@/components/settings/ai';

// Mock the useAISettings hook
vi.mock('@/components/settings/ai', async () => {
  const actual = await vi.importActual('@/components/settings/ai');
  return {
    ...actual,
    useAISettings: vi.fn().mockReturnValue({
      settings: {
        assistant_name: 'Custom AI Name'
      }
    }),
    AISettingsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

// Mock the useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn().mockReturnValue(false)
}));

describe('AIAssistantChatCard', () => {
  it('displays the correct assistant name from context', () => {
    // Render the component with mocked props
    render(
      <AIAssistantChatCard
        messages={[]}
        inputMessage=""
        setInputMessage={vi.fn()}
        handleSendMessage={vi.fn()}
        isLoading={false}
        canAccess={true}
        clearMessages={vi.fn()}
      />
    );

    // Check that the custom assistant name is displayed
    expect(screen.getByText(/Chat with Custom AI Name/i)).toBeInTheDocument();
  });

  it('falls back to default name if settings are not available', () => {
    // Override the mock to return null settings
    vi.mocked(require('@/components/settings/ai').useAISettings).mockReturnValueOnce({
      settings: null
    });

    // Render the component
    render(
      <AIAssistantChatCard
        messages={[]}
        inputMessage=""
        setInputMessage={vi.fn()}
        handleSendMessage={vi.fn()}
        isLoading={false}
        canAccess={true}
        clearMessages={vi.fn()}
      />
    );

    // Check that the default name is used
    expect(screen.getByText(/Chat with WAKTI AI/i)).toBeInTheDocument();
  });
});
