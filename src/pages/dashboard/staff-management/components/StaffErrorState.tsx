
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface StaffErrorStateProps {
  error: Error | null;
  authError: boolean;
  onRetry: () => void;
}

const StaffErrorState: React.FC<StaffErrorStateProps> = ({ 
  error, 
  authError, 
  onRetry 
}) => {
  return (
    <div 
      className="p-8 rounded-lg border border-red-200 bg-red-50 text-center space-y-4"
      data-testid="staff-error-state"
    >
      <div className="flex justify-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-700">
        {authError ? 'Authentication Error' : 'Failed to Load Staff'}
      </h3>
      
      <p className="text-red-600">
        {authError 
          ? 'Your session may have expired. Please try refreshing the page or logging in again.'
          : error?.message || 'An unexpected error occurred while loading your staff members.'}
      </p>
      
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="border-red-300 hover:bg-red-100"
      >
        Retry
      </Button>
    </div>
  );
};

export default StaffErrorState;
