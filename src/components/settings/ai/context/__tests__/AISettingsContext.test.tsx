
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AISettingsProvider, useAISettings } from '../AISettingsContext';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AISettings } from '@/types/ai-assistant.types';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the useAIAssistant hook
vi.mock('@/hooks/useAIAssistant', () => ({
  useAIAssistant: vi.fn(),
}));

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-id',
            },
          },
        },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 1 },
            error: null,
          }),
        }),
      }),
    }),
  },
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

// Sample AI settings for testing
const sampleSettings: AISettings = {
  id: 1,
  assistant_name: 'Test Assistant',
  tone: 'balanced',
  response_length: 'balanced',
  proactiveness: true,
  suggestion_frequency: 'medium',
  enabled_features: {
    tasks: true,
    events: true,
    staff: true,
    analytics: true,
    messaging: true,
  },
};

// Create a test component that uses the context
const TestComponent = () => {
  const { 
    settings, 
    isLoadingSettings, 
    error, 
    updateSettings,
    canUseAI,
    createDefaultSettings
  } = useAISettings();

  return (
    <div>
      <div data-testid="loading">{isLoadingSettings ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="can-use-ai">{canUseAI ? 'Can Use AI' : 'Cannot Use AI'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="assistant-name">{settings?.assistant_name || 'No Name'}</div>
      <button 
        data-testid="update-button" 
        onClick={() => settings && updateSettings({ ...settings, assistant_name: 'Updated Name' })}
      >
        Update Settings
      </button>
      <button 
        data-testid="create-button" 
        onClick={() => createDefaultSettings()}
      >
        Create Default Settings
      </button>
    </div>
  );
};

describe('AISettingsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides loading state correctly', () => {
    // Setup mock
    const mockUseAIAssistant = useAIAssistant as unknown as vi.Mock;
    mockUseAIAssistant.mockReturnValue({
      aiSettings: null,
      isLoadingSettings: true,
      updateSettings: { mutateAsync: vi.fn(), isPending: false },
      canUseAI: true,
      addKnowledge: { mutateAsync: vi.fn(), isPending: false },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: { mutateAsync: vi.fn() }
    });

    // Render
    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Assert
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
  });

  it('provides settings data correctly', async () => {
    // Setup mock
    const mockUseAIAssistant = useAIAssistant as unknown as vi.Mock;
    mockUseAIAssistant.mockReturnValue({
      aiSettings: sampleSettings,
      isLoadingSettings: false,
      updateSettings: { mutateAsync: vi.fn(), isPending: false },
      canUseAI: true,
      addKnowledge: { mutateAsync: vi.fn(), isPending: false },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: { mutateAsync: vi.fn() }
    });

    // Render
    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('assistant-name')).toHaveTextContent('Test Assistant');
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });
  });

  it('handles updateSettings correctly', async () => {
    // Create a mock for the update function
    const mockUpdateAsync = vi.fn().mockResolvedValue({ ...sampleSettings, assistant_name: 'Updated Name' });
    
    // Setup mock
    const mockUseAIAssistant = useAIAssistant as unknown as vi.Mock;
    mockUseAIAssistant.mockReturnValue({
      aiSettings: sampleSettings,
      isLoadingSettings: false,
      updateSettings: { mutateAsync: mockUpdateAsync, isPending: false },
      canUseAI: true,
      addKnowledge: { mutateAsync: vi.fn(), isPending: false },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: { mutateAsync: vi.fn() }
    });

    // Render
    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Click the update button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('update-button'));

    // Assert
    expect(mockUpdateAsync).toHaveBeenCalledWith({
      ...sampleSettings,
      assistant_name: 'Updated Name'
    });
  });

  it('handles createDefaultSettings correctly', async () => {
    // Setup mock for window.location.reload
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
    
    // Setup mock
    const mockUseAIAssistant = useAIAssistant as unknown as vi.Mock;
    mockUseAIAssistant.mockReturnValue({
      aiSettings: null,
      isLoadingSettings: false,
      updateSettings: { mutateAsync: vi.fn(), isPending: false },
      canUseAI: true,
      addKnowledge: { mutateAsync: vi.fn(), isPending: false },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: { mutateAsync: vi.fn() }
    });

    // Render
    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Click the create button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('create-button'));

    // Assert that the supabase from().insert() was called
    await waitFor(() => {
      const supabaseClient = require('@/integrations/supabase/client').supabase;
      expect(supabaseClient.from).toHaveBeenCalledWith('ai_assistant_settings');
    });

    // Restore original location
    window.location = originalLocation;
  });

  it('handles errors correctly', async () => {
    // Setup mock
    const mockUseAIAssistant = useAIAssistant as unknown as vi.Mock;
    mockUseAIAssistant.mockReturnValue({
      aiSettings: null,
      isLoadingSettings: false,
      updateSettings: { 
        mutateAsync: vi.fn().mockRejectedValue(new Error('Update failed')),
        isPending: false 
      },
      canUseAI: true,
      addKnowledge: { mutateAsync: vi.fn(), isPending: false },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: { mutateAsync: vi.fn() }
    });

    // Render
    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Initially there should be no error
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');

    // Click the update button which will trigger an error
    const user = userEvent.setup();
    await user.click(screen.getByTestId('update-button'));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Unable to save settings. Please try again.');
    });
  });
});
