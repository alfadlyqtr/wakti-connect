
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DashboardShell from '../DashboardShell';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock useAuthListener
vi.mock('../useAuthListener', () => ({
  useAuthListener: vi.fn(),
}));

// Mock useProfileData
vi.mock('@/hooks/useProfileData', () => ({
  useProfileData: () => ({
    profileData: { theme_preference: 'light' },
    isLoading: false,
  }),
}));

// Mock useThemeSetter
vi.mock('../useThemeSetter', () => ({
  useThemeSetter: vi.fn(),
}));

// Mock DashboardLayout
vi.mock('../DashboardLayout', () => ({
  default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}));

// Mock ProfileLoader
vi.mock('../ProfileLoader', () => ({
  default: () => <div data-testid="profile-loader">Loading...</div>,
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

describe('DashboardShell', () => {
  it('renders dashboard content when profile is loaded', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardShell />
      </QueryClientProvider>
    );
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
  
  it('renders loading state when profile is loading', () => {
    // Override the mock to return loading state
    vi.mocked(useProfileData).mockReturnValueOnce({
      profileData: null,
      isLoading: true,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardShell />
      </QueryClientProvider>
    );
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('profile-loader')).toBeInTheDocument();
  });
});
