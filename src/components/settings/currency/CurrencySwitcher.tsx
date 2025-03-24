
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SupportedCurrency, CURRENCY_NAMES, useCurrencySettings } from "@/hooks/useCurrencySettings";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CurrencySwitcher: React.FC = () => {
  const { 
    currency, 
    allCurrencies, 
    updateCurrency, 
    isUpdating, 
    isLoading 
  } = useCurrencySettings();
  
  const [selectedCurrency, setSelectedCurrency] = React.useState<SupportedCurrency>(currency);
  
  // Update local state when currency loads
  React.useEffect(() => {
    if (currency) {
      setSelectedCurrency(currency);
    }
  }, [currency]);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value as SupportedCurrency);
  };
  
  const handleSave = () => {
    if (selectedCurrency !== currency) {
      updateCurrency(selectedCurrency);
    }
  };
  
  // Helper to render currency flag
  const renderCurrencyFlag = (currencyCode: SupportedCurrency) => {
    switch(currencyCode) {
      case "BHD":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ background: 'linear-gradient(90deg, white 50%, #ce1126 50%)' }}></div>;
      case "OMR":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ background: 'linear-gradient(180deg, #e5203b 33%, white 33%, white 67%, #009b48 67%)' }}></div>;
      case "QAR":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ background: '#8d1b3d', borderLeft: '3px solid white' }}></div>;
      case "SAR":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ backgroundColor: '#006c35' }}></div>;
      case "AED":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ background: 'linear-gradient(180deg, #00732f 33%, white 33%, white 67%, black 67%)' }}></div>;
      case "KWD":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ background: 'linear-gradient(180deg, #007a3d 33%, white 33%, white 67%, #ce1126 67%)' }}></div>;
      case "USD":
        return <div className="h-4 w-6 rounded overflow-hidden" style={{ background: '#3c3b6e', backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjM2MzYjZlIi8+PHBhdGggZD0iTTAsMS4yNXYxLjVoMTB2LTEuNXptMCwzdjEuNWgxMHYtMS41em0wLDN2MS41aDEwdi0xLjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+")' }}></div>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>Loading currency settings...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>
          Select the currency to use throughout the application. 
          This setting affects how monetary values are displayed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedCurrency} 
          onValueChange={handleCurrencyChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {allCurrencies.map((currencyCode) => (
            <div key={currencyCode} className="flex items-center space-x-2">
              <RadioGroupItem value={currencyCode} id={`currency-${currencyCode}`} />
              <Label 
                htmlFor={`currency-${currencyCode}`}
                className="flex items-center space-x-2 cursor-pointer"
              >
                {renderCurrencyFlag(currencyCode)}
                <span className="font-medium">{CURRENCY_NAMES[currencyCode]}</span>
                <span className="text-muted-foreground">({currencyCode})</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isUpdating || selectedCurrency === currency}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySwitcher;
