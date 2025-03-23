
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, PlusCircle, Play, Square } from "lucide-react";
import { formatTime } from "@/utils/dateUtils";

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
    <Card className={activeWorkSession ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : "bg-muted/50"}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${activeWorkSession ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
              <Clock className={`h-5 w-5 ${activeWorkSession ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h3 className={`font-medium ${activeWorkSession ? "text-green-700 dark:text-green-400" : ""}`}>
                {activeWorkSession ? "Currently Working" : "Work Status"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeWorkSession 
                  ? `Started at ${formatTime(new Date(activeWorkSession.start_time))}` 
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
                  variant="default"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Job Card
                </Button>
                <Button
                  variant="destructive"
                  onClick={onEndWorkDay}
                  className="flex-1 sm:flex-auto"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Work Day
                </Button>
              </>
            ) : (
              <Button
                onClick={onStartWorkDay}
                className="w-full sm:w-auto"
                variant="success"
                style={{ backgroundColor: "#10B981", color: "white" }}
              >
                <Play className="h-4 w-4 mr-2" />
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
