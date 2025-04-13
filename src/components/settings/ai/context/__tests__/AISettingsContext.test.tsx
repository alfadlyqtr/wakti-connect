
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AISettingsProvider, useAISettings } from '../AISettingsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom'; // Add this to bring in toBeInTheDocument matcher

// Create a test component that uses the context
const TestComponent = () => {
  const { 
    settings, 
    error, 
    isLoadingSettings, 
    canUseAI,
    knowledgeUploads,
    isLoadingKnowledge 
  } = useAISettings();
  
  if (isLoadingSettings) return <div>Loading settings...</div>;
  if (error) return <div>Error: {typeof error === 'string' ? error : (error as Error).message}</div>;
  if (!settings) return <div>No settings found</div>;
  
  return (
    <div>
      <h1>AI Settings</h1>
      <p>Assistant Name: {settings.assistant_name}</p>
      <p>Role: {settings.role}</p>
      <p>Can Use AI: {canUseAI ? 'Yes' : 'No'}</p>
      <h2>Knowledge Uploads: {isLoadingKnowledge ? 'Loading...' : knowledgeUploads.length}</h2>
    </div>
  );
};

// Mock the hooks
jest.mock('@/hooks/auth', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}));

describe('AISettingsContext', () => {
  it('renders the provider without crashing', () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <AISettingsProvider>
          <TestComponent />
        </AISettingsProvider>
      </QueryClientProvider>
    );
    
    // Initial loading state
    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
  });
});
