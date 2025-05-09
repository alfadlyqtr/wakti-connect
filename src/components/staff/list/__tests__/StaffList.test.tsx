
import { render } from '@testing-library/react';
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

vi.mock('../useStaffListOperations', () => ({
  useStaffListOperations: () => ({
    deleteStaff: { mutateAsync: vi.fn() },
    toggleStaffStatus: { mutateAsync: vi.fn() },
    isSyncing: false,
    syncStaffRecords: vi.fn()
  })
}));

vi.mock('../../staff-list/StaffMembersLoading', () => ({
  default: () => <div>Loading staff members...</div>
}));

vi.mock('../../staff-list/StaffMembersError', () => ({
  default: ({ errorMessage, onRetry, onSync }) => (
    <div>
      Error: {errorMessage}
      <button onClick={onRetry}>Retry</button>
      <button onClick={onSync}>Sync</button>
    </div>
  )
}));

vi.mock('../../staff-list/EmptyStaffState', () => ({
  default: ({ onAddStaffClick, onSyncStaffClick }) => (
    <div>
      No staff members found
      <button onClick={onAddStaffClick}>Add Staff</button>
      <button onClick={onSyncStaffClick}>Sync</button>
    </div>
  )
}));

vi.mock('../../staff-list/DeleteStaffDialog', () => ({
  default: () => <div>Delete Staff Dialog</div>
}));

vi.mock('../../staff-list/ToggleStatusDialog', () => ({
  default: () => <div>Toggle Status Dialog</div>
}));

describe('StaffList', () => {
  let queryClient: QueryClient;

  const mockStaffMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      role: 'staff',
      staff_id: 'staff1',
      business_id: 'business1'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active',
      role: 'staff',
      staff_id: 'staff2',
      business_id: 'business1'
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
    const { getByTestId } = render(
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

    expect(getByTestId('staff-list-header')).toBeInTheDocument();
    expect(getByTestId('staff-list-content')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    const { getByText } = render(
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

    expect(getByText(/loading staff members/i)).toBeInTheDocument();
  });

  it('displays error state', () => {
    const error = new Error('Failed to load staff');
    
    const { getByText } = render(
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

    expect(getByText(/failed to load staff/i)).toBeInTheDocument();
  });

  it('handles empty staff list', () => {
    const { getByText } = render(
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

    expect(getByText(/no staff members found/i)).toBeInTheDocument();
  });
});
