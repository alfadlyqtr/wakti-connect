
import React from "react";

const DashboardSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wakti-blue"></div>
    </div>
  );
};

export default DashboardSpinner;
