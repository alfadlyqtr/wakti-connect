
import React from "react";
import { Badge } from "@/components/ui/badge";

interface BillingCycleToggleProps {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

const BillingCycleToggle = ({ billingCycle, setBillingCycle }: BillingCycleToggleProps) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex items-center bg-muted rounded-lg p-1">
        <button
          className={`px-4 py-2 rounded-md ${
            billingCycle === "monthly" ? "bg-background shadow-sm" : ""
          }`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            billingCycle === "yearly" ? "bg-background shadow-sm" : ""
          }`}
          onClick={() => setBillingCycle("yearly")}
        >
          <span className="flex items-center gap-2">
            Yearly
            <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">Save 16%</Badge>
          </span>
        </button>
      </div>
    </div>
  );
};

export default BillingCycleToggle;
