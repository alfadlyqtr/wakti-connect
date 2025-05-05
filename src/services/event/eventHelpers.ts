
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
      type: "solid",
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
    }
  };
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

/**
 * Transforms an EventCustomization object to JSON for storage
 */
export const stringifyEventCustomization = (customization: EventCustomization): string => {
  return JSON.stringify(customization);
};

/**
 * Prepares an event for database storage by converting customization to JSON string
 */
export const prepareEventForStorage = (event: any) => {
  // Skip if already a string or no customization
  if (!event.customization || typeof event.customization === 'string') {
    return event;
  }
  
  return {
    ...event,
    customization: stringifyEventCustomization(event.customization)
  };
};
