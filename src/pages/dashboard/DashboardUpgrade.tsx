
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PermissionGuard } from '@/features/auth';
import UpgradeHeader from "@/components/billing/UpgradeHeader";
import BillingCycleToggle from "@/components/billing/BillingCycleToggle";
import PlanCardsGrid from "@/components/billing/PlanCardsGrid";
import PlanActions from "@/components/billing/PlanActions";

const DashboardUpgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<"individual" | "business" | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedPlan) return;
    navigate('/dashboard/billing');
  };

  return (
    <PermissionGuard 
      feature="can_upgrade"
      fallback={
        <div className="text-center p-8">
          Staff accounts cannot upgrade plans. Please contact your business administrator.
        </div>
      }
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <UpgradeHeader />
        
        <BillingCycleToggle 
          billingCycle={billingCycle} 
          setBillingCycle={setBillingCycle} 
        />
        
        <PlanCardsGrid 
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          billingCycle={billingCycle}
        />
        
        <PlanActions 
          selectedPlan={selectedPlan}
          handleContinue={handleContinue}
        />
      </div>
    </PermissionGuard>
  );
};

export default DashboardUpgrade;
