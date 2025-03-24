
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { useProfileSettings } from "@/hooks/useProfileSettings";

type Currency = "USD" | "QAR" | "AED" | "SAR" | "KWD" | "BHD" | "OMR";

interface CurrencyOption {
  value: Currency;
  label: string;
  flag: string;
  symbol: string;
}

const currencies: CurrencyOption[] = [
  { value: "USD", label: "US Dollar (USD)", flag: "🇺🇸", symbol: "$" },
  { value: "QAR", label: "Qatari Riyal (QAR)", flag: "🇶🇦", symbol: "ر.ق" },
  { value: "AED", label: "UAE Dirham (AED)", flag: "🇦🇪", symbol: "د.إ" },
  { value: "SAR", label: "Saudi Arabian Riyal (SAR)", flag: "🇸🇦", symbol: "ر.س" },
  { value: "KWD", label: "Kuwaiti Dinar (KWD)", flag: "🇰🇼", symbol: "د.ك" },
  { value: "BHD", label: "Bahraini Dinar (BHD)", flag: "🇧🇭", symbol: ".د.ب" },
  { value: "OMR", label: "Omani Rial (OMR)", flag: "🇴🇲", symbol: "ر.ع" },
];

const CurrencyTab = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: profileData, updateProfile, isUpdating } = useProfileSettings();

  // Use the currency from profile data
  useEffect(() => {
    if (profileData?.currency_preference) {
      setCurrency(profileData.currency_preference as Currency);
    }
  }, [profileData]);

  const handleSaveCurrency = async () => {
    if (!user?.id) return;
    
    // Use the updateProfile function from useProfileSettings hook
    updateProfile({
      currency_preference: currency
    });
  };

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>
          Choose the currency you want to use throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        <RadioGroup
          value={currency}
          onValueChange={(value) => setCurrency(value as Currency)}
          className="space-y-3"
        >
          {currencies.map((currencyOption) => (
            <div
              key={currencyOption.value}
              className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50"
            >
              <RadioGroupItem value={currencyOption.value} id={currencyOption.value} />
              <Label
                htmlFor={currencyOption.value}
                className="flex flex-1 cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currencyOption.flag}</span>
                  <span>{currencyOption.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">{currencyOption.symbol}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleSaveCurrency}
          disabled={isUpdating || currency === profileData?.currency_preference}
          className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
        >
          {isUpdating ? "Saving..." : "Save Currency Preference"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrencyTab;
