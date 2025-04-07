
import React from "react";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";
import { useTranslation } from "react-i18next";

interface WorkDaySectionProps {
  activeWorkSession: any | null;
  startWorkDay: () => void;
  endWorkDay: () => void;
}

const WorkDaySection: React.FC<WorkDaySectionProps> = ({ 
  activeWorkSession, 
  startWorkDay, 
  endWorkDay 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">{t("staff.workDayTracking")}</h2>
      <WorkStatusCard 
        activeWorkSession={activeWorkSession}
        onStartWorkDay={startWorkDay}
        onEndWorkDay={endWorkDay}
        onCreateJobCard={() => window.location.href = "/dashboard/job-cards"}
      />
      <ActiveWorkSession session={activeWorkSession} />
    </div>
  );
};

export default WorkDaySection;
