
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AISettingsProvider, useAISettings } from '../AISettingsContext';
import { AISettings } from '@/types/ai-assistant.types';
import { vi, type Mock, type MockInstance } from 'vitest';

// Create a test component that uses the context
const TestComponent = () => {
  const { 
    settings, 
    isLoadingSettings, 
    error, 
    updateSettings, 
    addKnowledge,
    deleteKnowledge,
    createDefaultSettings,
    isCreatingSettings
  } = useAISettings();

  if (isLoadingSettings) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!settings) return <button onClick={createDefaultSettings}>Create Settings</button>;

  return (
    <div>
      <h1>Settings</h1>
      <div data-testid="assistant-name">{settings.assistant_name}</div>
      <button onClick={() => updateSettings({ ...settings, assistant_name: 'New Name' })}>
        Update Name
      </button>
      <button onClick={() => addKnowledge('Test Title', 'Test Content')}>
        Add Knowledge
      </button>
      <button onClick={() => deleteKnowledge('test-id')}>
        Delete Knowledge
      </button>
    </div>
  );
};

// Mock the useAIAssistant hook
vi.mock('@/hooks/useAIAssistant', () => ({
  useAIAssistant: vi.fn(() => ({
    aiSettings: null,
    isLoadingSettings: false,
    updateSettings: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
    addKnowledge: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
    knowledgeUploads: [],
    isLoadingKnowledge: false,
    deleteKnowledge: {
      mutateAsync: vi.fn(),
    },
    canUseAI: true,
  })),
}));

// Mock the createDefaultSettings function
vi.mock('../createDefaultSettings', () => ({
  createDefaultSettings: vi.fn(() => Promise.resolve()),
}));

describe('AISettingsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    // Update the mock to return loading state
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: null,
      isLoadingSettings: true,
      updateSettings: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render settings', () => {
    // Update the mock to return settings
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: {
        id: '1',
        assistant_name: 'Test Assistant',
        tone: 'formal',
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
      } as unknown as AISettings,
      isLoadingSettings: false,
      updateSettings: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    expect(screen.getByText('Settings')).toHaveTextContent('Settings');
    expect(screen.getByTestId('assistant-name')).toHaveTextContent('Test Assistant');
  });

  it('should handle update settings', async () => {
    const mockUpdateSettings = vi.fn() as Mock<any>;
    
    // Update the mock to return settings and the update function
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: {
        id: '1',
        assistant_name: 'Test Assistant',
        tone: 'formal',
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
      } as unknown as AISettings,
      isLoadingSettings: false,
      updateSettings: {
        mutateAsync: mockUpdateSettings,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Click the update button
    const user = userEvent.setup();
    await user.click(screen.getByText('Update Name'));

    // Verify that the update function was called with the correct arguments
    expect(mockUpdateSettings).toHaveBeenCalledWith({
      id: '1',
      assistant_name: 'New Name',
      tone: 'formal',
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
    });
  });

  it('should handle add knowledge', async () => {
    const mockAddKnowledge = vi.fn() as Mock<any>;
    
    // Update the mock to return settings and the add knowledge function
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: {
        id: '1',
        assistant_name: 'Test Assistant',
        tone: 'formal',
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
      } as unknown as AISettings,
      isLoadingSettings: false,
      updateSettings: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: mockAddKnowledge,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Click the add knowledge button
    const user = userEvent.setup();
    await user.click(screen.getByText('Add Knowledge'));

    // Verify that the add knowledge function was called with the correct arguments
    expect(mockAddKnowledge).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content',
    });
  });

  it('should handle delete knowledge', async () => {
    const mockDeleteKnowledge = vi.fn() as Mock<any>;
    
    // Update the mock to return settings and the delete knowledge function
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: {
        id: '1',
        assistant_name: 'Test Assistant',
        tone: 'formal',
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
      } as unknown as AISettings,
      isLoadingSettings: false,
      updateSettings: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: mockDeleteKnowledge,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Click the delete knowledge button
    const user = userEvent.setup();
    await user.click(screen.getByText('Delete Knowledge'));

    // Verify that the delete knowledge function was called with the correct arguments
    expect(mockDeleteKnowledge).toHaveBeenCalledWith('test-id');
  });

  it('should handle create default settings', async () => {
    // Mock the createDefaultSettings function
    const createDefaultSettingsMock = require('../createDefaultSettings').createDefaultSettings as MockInstance;
    createDefaultSettingsMock.mockResolvedValue(undefined);
    
    // Update the mock to return null settings to trigger the create default settings button
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: null,
      isLoadingSettings: false,
      updateSettings: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    // Click the create settings button
    const user = userEvent.setup();
    await user.click(screen.getByText('Create Settings'));

    // Verify that the create default settings function was called
    expect(createDefaultSettingsMock).toHaveBeenCalled();
  });

  it('should handle error', () => {
    // Update the mock to return an error
    const useAIAssistant = require('@/hooks/useAIAssistant').useAIAssistant;
    useAIAssistant.mockReturnValue({
      aiSettings: null,
      isLoadingSettings: false,
      settingsError: new Error('Test error'),
      updateSettings: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      addKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
        isPending: false,
      },
      knowledgeUploads: [],
      isLoadingKnowledge: false,
      deleteKnowledge: {
        mutateAsync: vi.fn() as Mock<any>,
      },
      canUseAI: true,
    });

    render(
      <AISettingsProvider>
        <TestComponent />
      </AISettingsProvider>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
});
