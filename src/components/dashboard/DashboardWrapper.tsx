
import React from "react";
import { useTrialStatus } from "./TrialStatusProvider";
import TrialStatusBanner from "../billing/TrialStatusBanner";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  const { trialEndsAt, isInTrial, currentPlan, isLoading } = useTrialStatus();
  
  return (
    <div className="space-y-6">
      {!isLoading && isInTrial && currentPlan && (
        <TrialStatusBanner 
          trialEndsAt={trialEndsAt} 
          currentPlan={currentPlan} 
        />
      )}
      {children}
    </div>
  );
};

export default DashboardWrapper;
