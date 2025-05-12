
import { Event, EventCustomization } from "@/types/event.types";

/**
 * Parses the customization field from JSON to EventCustomization
 */
export const parseEventCustomization = (customizationJson: any): EventCustomization => {
  // If already an object, return as is
  if (typeof customizationJson === 'object' && customizationJson !== null) {
    return customizationJson as EventCustomization;
  }
  
  // If it's a string, try to parse it
  if (typeof customizationJson === 'string') {
    try {
      return JSON.parse(customizationJson) as EventCustomization;
    } catch (error) {
      console.error("Error parsing customization JSON:", error);
    }
  }
  
  // Default customization if parsing fails
  return {
    background: {
      type: "color",
      value: "#ffffff"
    },
    font: {
      family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      size: "medium",
      color: "#333333"
    },
    buttons: {
      accept: {
        background: "#4CAF50",
        color: "#ffffff",
        shape: "rounded"
      },
      decline: {
        background: "#f44336",
        color: "#ffffff",
        shape: "rounded"
      }
    },
    headerStyle: 'simple',
    animation: 'fade'
  };
};

/**
 * Prepares event data for storage in the database
 */
export const prepareEventForStorage = (eventData: any): any => {
  const preparedData = { ...eventData };
  
  // Ensure customization is a valid object or stringify it
  if (preparedData.customization && typeof preparedData.customization === 'object') {
    // Keep as is - Supabase will handle JSON conversion
  } else if (preparedData.customization) {
    preparedData.customization = JSON.stringify(preparedData.customization);
  }
  
  return preparedData;
};

/**
 * Transforms a database event to a frontend Event object with parsed customization
 */
export const transformDatabaseEvent = (dbEvent: any): Event => {
  return {
    ...dbEvent,
    customization: parseEventCustomization(dbEvent.customization)
  };
};
