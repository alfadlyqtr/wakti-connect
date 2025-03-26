
import React from "react";
import { useCustomization } from "../context";
import ButtonsTab from "../tabs/ButtonsTab";

const ButtonsTabContent: React.FC = () => {
  const {
    customization,
    handleButtonStyleChange,
    handleToggleButtons,
    handleToggleCalendar
  } = useCustomization();

  return (
    <ButtonsTab 
      customization={customization}
      onButtonStyleChange={handleButtonStyleChange}
      onToggleButtons={handleToggleButtons}
      onToggleCalendarButton={handleToggleCalendar}
    />
  );
};

export default ButtonsTabContent;
