
import React, { ReactNode } from "react";
import { Users, Calendar, Clock } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
      <StatsCard
        title="Subscribers"
        value={subscribersLoading ? (
          <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
        ) : (
          subscriberCount
        )}
        icon={Users}
        subtitle="+12% from last month"
      />

      <StatsCard
        title="Bookings"
        value={78}
        icon={Calendar}
        subtitle="This month"
      />

      <StatsCard
        title="Staff"
        value={staffLoading ? (
          <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
        ) : (
          staffCount
        )}
        icon={Clock}
        subtitle="Active staff members"
      />
    </div>
  );
};
