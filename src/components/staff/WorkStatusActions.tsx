
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, ClipboardList } from "lucide-react";

interface WorkStatusActionsProps {
  activeWorkSession: any | null;
  onStartWorkDay: () => void;
  onEndWorkDay: () => void;
  onCreateJobCard: () => void;
}

const WorkStatusActions: React.FC<WorkStatusActionsProps> = ({
  activeWorkSession,
  onStartWorkDay,
  onEndWorkDay,
  onCreateJobCard
}) => {
  if (!activeWorkSession) {
    return (
      <Button 
        onClick={onStartWorkDay}
        variant="default"
        className="flex-1"
      >
        <Clock className="h-4 w-4 mr-2" />
        Start Work Day
      </Button>
    );
  }
  
  return (
    <>
      <Button 
        onClick={onEndWorkDay}
        variant="outline"
        className="flex-1"
      >
        <Clock className="h-4 w-4 mr-2" />
        End Work Day
      </Button>
      <Button 
        onClick={onCreateJobCard}
        className="flex-1"
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        Create Job Card
      </Button>
    </>
  );
};

export default WorkStatusActions;
