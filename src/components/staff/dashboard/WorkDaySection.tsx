
import React from "react";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";

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
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Work Day Tracking</h2>
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
