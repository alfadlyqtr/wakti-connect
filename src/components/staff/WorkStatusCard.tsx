
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import WorkSessionStatus from "./WorkSessionStatus";
import WorkStatusActions from "./WorkStatusActions";

interface WorkStatusCardProps {
  activeWorkSession: any | null;
  onStartWorkDay: () => void;
  onEndWorkDay: () => void;
  onCreateJobCard: () => void;
}

const WorkStatusCard: React.FC<WorkStatusCardProps> = ({
  activeWorkSession,
  onStartWorkDay,
  onEndWorkDay,
  onCreateJobCard
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-wakti-blue" />
          Work Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WorkSessionStatus activeWorkSession={activeWorkSession} />
      </CardContent>
      <CardFooter className="flex gap-3 flex-wrap">
        <WorkStatusActions 
          activeWorkSession={activeWorkSession}
          onStartWorkDay={onStartWorkDay}
          onEndWorkDay={onEndWorkDay}
          onCreateJobCard={onCreateJobCard}
        />
      </CardFooter>
    </Card>
  );
};

export default WorkStatusCard;
