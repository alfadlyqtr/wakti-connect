
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SidebarManager from '../SidebarManager';

// Mock useIsMobile hook
vi.mock('@/hooks/useResponsive', () => ({
  useIsMobile: () => false,  // Default to desktop view
}));

// Mock useLocation
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/dashboard' }),
}));

describe('SidebarManager', () => {
  it('renders children correctly', () => {
    const setIsSidebarOpen = vi.fn();
    
    render(
      <SidebarManager isSidebarOpen={true} setIsSidebarOpen={setIsSidebarOpen}>
        <div data-testid="sidebar-content">Sidebar Content</div>
      </SidebarManager>
    );
    
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
  });
  
  it('mobile: closes sidebar on navigation', () => {
    // Override the mock to simulate mobile view
    vi.mocked(useIsMobile).mockReturnValueOnce(true);
    
    const setIsSidebarOpen = vi.fn();
    
    render(
      <SidebarManager isSidebarOpen={true} setIsSidebarOpen={setIsSidebarOpen}>
        <div>Sidebar Content</div>
      </SidebarManager>
    );
    
    // Simulate navigation by triggering a location change effect
    vi.mocked(useLocation).mockReturnValueOnce({ pathname: '/dashboard/tasks' });
    
    // Re-render to trigger the effect
    render(
      <SidebarManager isSidebarOpen={true} setIsSidebarOpen={setIsSidebarOpen}>
        <div>Sidebar Content</div>
      </SidebarManager>
    );
    
    // Verify sidebar was closed
    expect(setIsSidebarOpen).toHaveBeenCalledWith(false);
  });

  it('should not close sidebar on navigation in desktop view', () => {
    const setIsSidebarOpen = vi.fn();
    
    render(
      <SidebarManager isSidebarOpen={true} setIsSidebarOpen={setIsSidebarOpen}>
        <div>Sidebar Content</div>
      </SidebarManager>
    );
    
    // Simulate navigation
    vi.mocked(useLocation).mockReturnValueOnce({ pathname: '/dashboard/tasks' });
    
    // Re-render to trigger the effect
    render(
      <SidebarManager isSidebarOpen={true} setIsSidebarOpen={setIsSidebarOpen}>
        <div>Sidebar Content</div>
      </SidebarManager>
    );
    
    // In desktop view, sidebar should not be closed
    expect(setIsSidebarOpen).not.toHaveBeenCalled();
  });
});
