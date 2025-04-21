
import React from 'react';
import BrandLogoSpinner from "@/components/ui/BrandLogoSpinner";

const DashboardLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <BrandLogoSpinner size={72} />
    </div>
  );
};

export default DashboardLoading;
