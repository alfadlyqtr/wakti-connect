
import React from 'react';

const DashboardLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
    </div>
  );
};

export default DashboardLoading;
