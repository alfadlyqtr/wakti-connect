
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface JobCardsRetryButtonProps {
  onRetry: () => void;
  isRetrying: boolean;
}

const JobCardsRetryButton: React.FC<JobCardsRetryButtonProps> = ({ 
  onRetry, 
  isRetrying 
}) => {
  return (
    <div className="flex justify-center mt-4">
      <Button 
        onClick={onRetry}
        disabled={isRetrying}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isRetrying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {isRetrying ? "Refreshing..." : "Retry loading job cards"}
      </Button>
    </div>
  );
};

export default JobCardsRetryButton;
