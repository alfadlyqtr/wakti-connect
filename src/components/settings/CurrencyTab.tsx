
import React from "react";
import CurrencySwitcher from "./currency/CurrencySwitcher";

const CurrencyTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <CurrencySwitcher />
    </div>
  );
};

export default CurrencyTab;
