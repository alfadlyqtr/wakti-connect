import React from 'react';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import DashboardEventsPreview from '@/components/dashboard/home/DashboardEventsPreview';
import DashboardProfilePreview from '@/components/dashboard/home/DashboardProfilePreview';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { UserRole } from '@/types/user';
import { useDashboardUserProfile } from '@/hooks/useDashboardUserProfile';

const DashboardHome: React.FC = () => {
  const { data: profile } = useProfileSettings();
  const { userRole } = useDashboardUserProfile();

  return (
    <DashboardWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <DashboardProfilePreview />
        </div>
        
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <DashboardEventsPreview userRole={userRole as UserRole} />
        </div>
        
        {/* Other dashboard widgets can be added here */}
      </div>
    </DashboardWrapper>
  );
};

export default DashboardHome;
