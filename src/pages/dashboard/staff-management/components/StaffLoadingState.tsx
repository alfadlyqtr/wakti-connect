
import React from 'react';

const StaffLoadingState: React.FC = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 space-y-4"
      data-testid="staff-loading-state"
    >
      <div className="h-12 w-12 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      <p className="text-muted-foreground">Loading staff members...</p>
    </div>
  );
};

export default StaffLoadingState;
