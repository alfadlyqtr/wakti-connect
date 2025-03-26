
import React from "react";
import { useCustomization } from "../context";
import HeaderTab from "../tabs/HeaderTab";

const HeaderTabContent: React.FC = () => {
  const {
    customization,
    handleHeaderStyleChange,
    handleHeaderImageChange
  } = useCustomization();

  return (
    <HeaderTab 
      customization={customization}
      onHeaderStyleChange={handleHeaderStyleChange}
      onHeaderImageChange={handleHeaderImageChange}
    />
  );
};

export default HeaderTabContent;
