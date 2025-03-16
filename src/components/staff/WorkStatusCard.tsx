
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, PlusCircle } from "lucide-react";

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
  onCreateJobCard,
}) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Work Status</h3>
              <p className="text-sm text-muted-foreground">
                {activeWorkSession 
                  ? `Currently working since ${new Date(activeWorkSession.start_time).toLocaleTimeString()}` 
                  : "Not currently working"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 sm:ml-auto">
            {activeWorkSession ? (
              <>
                <Button
                  onClick={onCreateJobCard}
                  className="flex-1 sm:flex-auto"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Job Card
                </Button>
                <Button
                  variant="outline"
                  onClick={onEndWorkDay}
                  className="flex-1 sm:flex-auto"
                >
                  End Work Day
                </Button>
              </>
            ) : (
              <Button
                onClick={onStartWorkDay}
                className="w-full sm:w-auto"
              >
                Start Work Day
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkStatusCard;
