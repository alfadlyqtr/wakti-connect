
import React from "react";
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TrialStatusBannerProps {
  trialEndsAt: Date | null;
  currentPlan: "individual" | "business";
  className?: string;
}

const TrialStatusBanner: React.FC<TrialStatusBannerProps> = ({
  trialEndsAt,
  currentPlan,
  className
}) => {
  const navigate = useNavigate();
  
  // If no trial end date or it's in the past, don't show the banner
  if (!trialEndsAt || new Date(trialEndsAt) < new Date()) {
    return null;
  }
  
  // Calculate days left in trial
  const today = new Date();
  const endDate = new Date(trialEndsAt);
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format the trial end date
  const formattedEndDate = endDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className={cn(
      "p-4 bg-amber-50 border border-amber-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Your {currentPlan === "business" ? "Business" : "Individual"} plan trial is active</h3>
          <p className="text-sm text-muted-foreground">
            {daysLeft > 1 
              ? `You have ${daysLeft} days left in your trial, ending on ${formattedEndDate}` 
              : `Your trial ends tomorrow on ${formattedEndDate}`}
          </p>
        </div>
      </div>
      <Button 
        onClick={() => navigate("/dashboard/billing")}
        size="sm"
        className="shrink-0"
      >
        Activate Subscription
      </Button>
    </div>
  );
};

export default TrialStatusBanner;
