
import React from "react";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";
import WorkHistory from "@/components/staff/WorkHistory";

interface WorkSessionSectionProps {
  staffRelationId: string;
  activeWorkSession: any | null;
}

const WorkSessionSection: React.FC<WorkSessionSectionProps> = ({ 
  staffRelationId,
  activeWorkSession
}) => {
  return (
    <div className="pt-6 border-t">
      <h3 className="font-medium text-lg mb-4">Work Session History</h3>
      <ActiveWorkSession session={activeWorkSession} />
      <div className="mt-4">
        <WorkHistory staffRelationId={staffRelationId} />
      </div>
    </div>
  );
};

export default WorkSessionSection;
