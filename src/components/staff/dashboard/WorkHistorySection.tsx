
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import WorkHistory from "@/components/staff/WorkHistory";

interface WorkHistorySectionProps {
  staffRelationId: string;
}

const WorkHistorySection: React.FC<WorkHistorySectionProps> = ({ staffRelationId }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Recent Work History</h2>
      <Card>
        <CardContent className="p-6">
          <WorkHistory staffRelationId={staffRelationId} limit={5} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkHistorySection;
