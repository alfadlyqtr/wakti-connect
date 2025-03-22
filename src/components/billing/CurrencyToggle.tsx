
import React from "react";
import { Currency } from "@/components/pricing/usePricingPlans";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/mocks/translationMock";

interface CurrencyToggleProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ 
  currency, 
  setCurrency 
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant={currency === "QAR" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("QAR")}
        className="text-sm px-4 flex items-center gap-1.5"
      >
        <div className="h-3.5 w-5 relative overflow-hidden" style={{ borderRadius: '2px' }}>
          {/* Qatar flag: white left side, maroon right side with serrated dividing line */}
          <div className="absolute inset-0" style={{ background: 'white' }}></div>
          <div 
            className="absolute top-0 bottom-0 right-0" 
            style={{ 
              background: '#8d1b3d', 
              width: '70%',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 11% 90%, 0 80%, 11% 70%, 0 60%, 11% 50%, 0 40%, 11% 30%, 0 20%, 11% 10%)'
            }}
          ></div>
        </div>
        {isRtl ? 'ر.ق' : 'QAR'}
      </Button>
      <Button
        variant={currency === "USD" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("USD")}
        className="text-sm px-4 flex items-center gap-1.5"
      >
        <div className="h-3.5 w-5 relative overflow-hidden" style={{ borderRadius: '2px' }}>
          {/* USA flag: stripes and blue rectangle */}
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(180deg, #bf0a30 0%, #bf0a30 15.38%, white 15.38%, white 30.77%, #bf0a30 30.77%, #bf0a30 46.15%, white 46.15%, white 61.54%, #bf0a30 61.54%, #bf0a30 76.92%, white 76.92%, white 92.31%, #bf0a30 92.31%, #bf0a30 100%)'
          }}></div>
          <div 
            className="absolute top-0 left-0 bottom-0" 
            style={{ 
              background: '#002868',
              width: '40%'
            }}
          ></div>
        </div>
        {isRtl ? '$' : 'USD'}
      </Button>
    </div>
  );
};

export default CurrencyToggle;
