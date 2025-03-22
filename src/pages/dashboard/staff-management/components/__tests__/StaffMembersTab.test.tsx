
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffMembersTab from '../StaffMembersTab';
import { useStaffMembers } from '@/hooks/staff/useStaffMembers';

// Mock dependencies
jest.mock('@/hooks/staff/useStaffMembers');

describe('StaffMembersTab', () => {
  const mockSelectStaff = jest.fn();
  const mockOpenCreateDialog = jest.fn();
  const mockRefetch = jest.fn();
  const mockHandleManualRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: true,
      staffMembers: undefined,
      error: null,
      authError: false,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    expect(screen.getByTestId('staff-loading-state')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockError = new Error('Failed to fetch staff members');
    
    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: false,
      staffMembers: undefined,
      error: mockError,
      authError: false,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    expect(screen.getByTestId('staff-error-state')).toBeInTheDocument();
  });

  it('renders auth error state', () => {
    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: false,
      staffMembers: undefined,
      error: null,
      authError: true,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    expect(screen.getByTestId('staff-error-state')).toBeInTheDocument();
  });

  it('renders empty state when no staff members', () => {
    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: false,
      staffMembers: [],
      error: null,
      authError: false,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    expect(screen.getByTestId('empty-staff-state')).toBeInTheDocument();

    // Test create button functionality
    fireEvent.click(screen.getByText(/add staff/i));
    expect(mockOpenCreateDialog).toHaveBeenCalled();
  });

  it('renders staff members list when data is available', () => {
    const mockStaffMembers = [
      {
        id: 'staff-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'staff',
      },
      {
        id: 'staff-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'co-admin',
      },
    ];

    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: false,
      staffMembers: mockStaffMembers,
      error: null,
      authError: false,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    expect(screen.getByTestId('staff-members-list')).toBeInTheDocument();
  });

  it('calls refetch on mount', async () => {
    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: false,
      staffMembers: [],
      error: null,
      authError: false,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('calls handleManualRefetch when refresh button is clicked', () => {
    const mockStaffMembers = [
      {
        id: 'staff-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'staff',
      },
    ];

    (useStaffMembers as jest.Mock).mockReturnValue({
      isLoading: false,
      staffMembers: mockStaffMembers,
      error: null,
      authError: false,
      refetch: mockRefetch,
      handleManualRefetch: mockHandleManualRefetch,
    });

    render(
      <StaffMembersTab
        onSelectStaff={mockSelectStaff}
        onOpenCreateDialog={mockOpenCreateDialog}
      />
    );

    // Find and click the refresh button
    fireEvent.click(screen.getByTestId('refresh-button'));
    expect(mockHandleManualRefetch).toHaveBeenCalled();
  });
});
