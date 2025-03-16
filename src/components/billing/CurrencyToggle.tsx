
import React from "react";
import { Currency } from "@/components/pricing/usePricingPlans";
import { Button } from "@/components/ui/button";

interface CurrencyToggleProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ 
  currency, 
  setCurrency 
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant={currency === "QAR" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("QAR")}
        className="text-sm px-4"
      >
        QAR
      </Button>
      <Button
        variant={currency === "USD" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("USD")}
        className="text-sm px-4"
      >
        USD
      </Button>
    </div>
  );
};

export default CurrencyToggle;
