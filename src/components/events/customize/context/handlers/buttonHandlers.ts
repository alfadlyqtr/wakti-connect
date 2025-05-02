
import { EventCustomization } from "@/types/event.types";
import { produce } from "immer";

export const createButtonHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleButtonStyleChange = (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => {
    onCustomizationChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [type]: {
          ...customization.buttons[type],
          [property]: value
        }
      }
    });
  };

  const handleUtilityButtonStyleChange = (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => {
    const updatedCustomization = produce(customization, draft => {
      // Initialize utilityButtons if it doesn't exist
      if (!draft.utilityButtons) {
        draft.utilityButtons = {};
      }
      
      // Initialize the specific button type if it doesn't exist
      if (!draft.utilityButtons[buttonType]) {
        draft.utilityButtons[buttonType] = {
          background: '#ffffff',
          color: '#000000',
          shape: 'rounded'
        };
      }
      
      // Update the property with type safety
      if (property === 'shape') {
        // Ensure value is one of the allowed shape types
        const safeShape = (value === 'rounded' || value === 'pill' || value === 'square') 
          ? value 
          : 'rounded';
        draft.utilityButtons[buttonType][property] = safeShape;
      } else {
        draft.utilityButtons[buttonType][property] = value;
      }
    });
    
    onCustomizationChange(updatedCustomization);
  };

  // Add missing button handlers
  const handleAcceptButtonChange = (property: string, value: string) => {
    handleButtonStyleChange('accept', property as 'background' | 'color' | 'shape', value);
  };

  const handleDeclineButtonChange = (property: string, value: string) => {
    handleButtonStyleChange('decline', property as 'background' | 'color' | 'shape', value);
  };

  const handleButtonShapeChange = (shape: string) => {
    // Apply the shape to both accept and decline buttons
    handleButtonStyleChange('accept', 'shape', shape);
    handleButtonStyleChange('decline', 'shape', shape);
  };

  const handleShowButtonsChange = (show: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: show
    });
  };

  return {
    handleButtonStyleChange,
    handleUtilityButtonStyleChange,
    handleAcceptButtonChange,
    handleDeclineButtonChange,
    handleButtonShapeChange,
    handleShowButtonsChange
  };
};
