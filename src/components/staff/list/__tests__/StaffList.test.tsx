
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StaffList } from '../StaffList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, vi, describe, it, beforeEach } from 'vitest';

// Mock child components
vi.mock('../StaffListHeader', () => ({
  default: () => <div data-testid="staff-list-header">Staff List Header</div>
}));

vi.mock('../StaffListContent', () => ({
  default: ({ staffMembers }: { staffMembers: any[] }) => (
    <div data-testid="staff-list-content">
      Staff Members: {staffMembers.length}
    </div>
  )
}));

describe('StaffList', () => {
  let queryClient: QueryClient;

  const mockStaffMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      role: 'staff'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active',
      role: 'staff'
    }
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList
          staffMembers={mockStaffMembers}
          isLoading={false}
          error={null}
          onEdit={() => {}}
          onRefresh={() => {}}
        />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('staff-list-header')).toBeInTheDocument();
    expect(screen.getByTestId('staff-list-content')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList
          staffMembers={[]}
          isLoading={true}
          error={null}
          onEdit={() => {}}
          onRefresh={() => {}}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state', () => {
    const error = new Error('Failed to load staff');
    
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList
          staffMembers={[]}
          isLoading={false}
          error={error}
          onEdit={() => {}}
          onRefresh={() => {}}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText(/failed to load staff/i)).toBeInTheDocument();
  });

  it('handles empty staff list', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList
          staffMembers={[]}
          isLoading={false}
          error={null}
          onEdit={() => {}}
          onRefresh={() => {}}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText(/no staff members/i)).toBeInTheDocument();
  });
});
