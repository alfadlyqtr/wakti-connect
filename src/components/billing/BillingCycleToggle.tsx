
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BillingCycleToggleProps {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

const BillingCycleToggle = ({ billingCycle, setBillingCycle }: BillingCycleToggleProps) => {
  const handleToggle = (checked: boolean) => {
    setBillingCycle(checked ? "yearly" : "monthly");
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <div className="flex items-center space-x-2">
        <div className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly billing
        </div>
        <Switch
          id="billing-cycle"
          checked={billingCycle === "yearly"}
          onCheckedChange={handleToggle}
        />
        <div className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly billing
        </div>
      </div>
      
      {billingCycle === "yearly" && (
        <div className="text-sm bg-green-500/10 text-green-500 px-3 py-1 rounded-full">
          Save up to 20% with annual billing
        </div>
      )}
    </div>
  );
};

export default BillingCycleToggle;
