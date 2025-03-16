
import React from "react";
import { Currency } from "@/components/pricing/usePricingPlans";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

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
        className="text-sm px-4 flex items-center gap-1.5"
      >
        <Flag 
          className="h-3.5 w-3.5" 
          strokeWidth={0}
          fill="#8d1b3d" 
          style={{ 
            background: 'white',
            borderRadius: '2px'
          }}
        /> 
        QAR
      </Button>
      <Button
        variant={currency === "USD" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("USD")}
        className="text-sm px-4 flex items-center gap-1.5"
      >
        <Flag 
          className="h-3.5 w-3.5" 
          strokeWidth={0}
          fill="#002868" 
          style={{ 
            background: 'linear-gradient(180deg, #bf0a30 0%, #bf0a30 16.66%, white 16.66%, white 33.33%, #bf0a30 33.33%, #bf0a30 50%, white 50%, white 66.66%, #bf0a30 66.66%, #bf0a30 83.33%, white 83.33%, white 100%)',
            borderRadius: '2px'
          }}
        /> 
        USD
      </Button>
    </div>
  );
};

export default CurrencyToggle;
