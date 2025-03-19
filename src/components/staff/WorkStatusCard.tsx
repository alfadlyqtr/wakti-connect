
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import WorkSessionStatus from "./WorkSessionStatus";
import WorkStatusActions from "./WorkStatusActions";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

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
        <ErrorBoundary fallback={
          <div className="text-destructive text-sm">
            Error displaying work status. Please refresh the page.
          </div>
        }>
          <WorkSessionStatus activeWorkSession={activeWorkSession} />
        </ErrorBoundary>
      </CardContent>
      <CardFooter className="flex gap-3 flex-wrap">
        <ErrorBoundary fallback={
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground w-full"
          >
            Refresh Page
          </button>
        }>
          <WorkStatusActions 
            activeWorkSession={activeWorkSession}
            onStartWorkDay={onStartWorkDay}
            onEndWorkDay={onEndWorkDay}
            onCreateJobCard={onCreateJobCard}
          />
        </ErrorBoundary>
      </CardFooter>
    </Card>
  );
};

export default WorkStatusCard;
