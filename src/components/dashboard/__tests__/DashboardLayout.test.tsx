
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';

// Mock the required components
vi.mock('@/components/layout/Navbar', () => ({
  default: ({ toggleSidebar, isSidebarOpen }) => (
    <div data-testid="navbar">
      <button data-testid="toggle-sidebar" onClick={toggleSidebar}>
        Toggle Sidebar {isSidebarOpen ? 'Open' : 'Closed'}
      </button>
    </div>
  ),
}));

vi.mock('@/components/layout/Sidebar', () => ({
  default: ({ isOpen, userRole }) => (
    <div data-testid="sidebar">
      Sidebar {isOpen ? 'Open' : 'Closed'} - Role: {userRole}
    </div>
  ),
}));

vi.mock('../SidebarManager', () => ({
  default: ({ children, isSidebarOpen, setIsSidebarOpen }) => (
    <div data-testid="sidebar-manager">
      <button 
        data-testid="close-sidebar" 
        onClick={() => setIsSidebarOpen(false)}
      >
        Close Sidebar
      </button>
      {children}
    </div>
  ),
}));

describe('DashboardLayout', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div data-testid="children-content">Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-manager')).toBeInTheDocument();
    expect(screen.getByTestId('children-content')).toBeInTheDocument();
  });

  it('should render sidebar with correct initial state', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );
    
    // Initially the sidebar should be closed
    expect(screen.getByTestId('sidebar')).toHaveTextContent('Sidebar Closed');
  });
});
