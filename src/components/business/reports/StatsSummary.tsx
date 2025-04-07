
import React, { ReactNode } from "react";
import { Users, Calendar, Clock } from "lucide-react";
import { StatsCard } from "@/components/business/StatsCard";
import { useTranslation } from "react-i18next";

interface StatsSummaryProps {
  subscriberCount: number | ReactNode;
  subscribersLoading: boolean;
  staffCount: number | ReactNode;
  staffLoading: boolean;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  subscriberCount,
  subscribersLoading,
  staffCount,
  staffLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
      <StatsCard
        title={t('sidebar.subscribers')}
        value={subscribersLoading ? (
          <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
        ) : (
          subscriberCount
        )}
        icon={Users}
        subtitle="+12% from last month"
      />

      <StatsCard
        title={t('booking.reference')}
        value={78}
        icon={Calendar}
        subtitle="This month"
      />

      <StatsCard
        title={t('sidebar.staff')}
        value={staffLoading ? (
          <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
        ) : (
          staffCount
        )}
        icon={Clock}
        subtitle={t('dashboard.activeStaff')}
      />
    </div>
  );
};
