
import React from "react";
import { useCustomization } from "../context";
import ButtonsTab from "../tabs/ButtonsTab";

const ButtonsTabContent: React.FC = () => {
  const {
    customization,
    handleAcceptButtonChange,
    handleDeclineButtonChange,
    handleButtonShapeChange,
    handleShowButtonsChange,
    handleAddToCalendarChange
  } = useCustomization();

  // Create adapter functions for the ButtonsTab component
  const handleButtonStyleChange = (buttonType: string, property: string, value: string) => {
    if (buttonType === 'accept') {
      handleAcceptButtonChange(property, value);
    } else if (buttonType === 'decline') {
      handleDeclineButtonChange(property, value);
    }
  };

  const handleToggleButtons = (enabled: boolean) => {
    handleShowButtonsChange(enabled);
  };

  const handleToggleCalendar = (enabled: boolean) => {
    handleAddToCalendarChange(enabled);
  };

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
