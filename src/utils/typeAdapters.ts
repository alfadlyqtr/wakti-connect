
import { Event, EventCustomization } from "@/types/event.types";

// Helper function to convert JSON data from Supabase to properly typed objects
export function convertToEventCustomization(jsonData: any): EventCustomization {
  // Handle the case where jsonData might be a string
  const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
  
  // Create default EventCustomization structure with required fields
  const defaultCustomization: EventCustomization = {
    background: {
      type: 'solid',
      value: '#ffffff',
    },
    font: {
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 'medium',
      color: '#333333',
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded',
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded',
      }
    }
  };
  
  // If no data, return default
  if (!data) return defaultCustomization;
  
  // Merge the data with defaults to ensure all required fields exist
  return {
    background: {
      type: data.background?.type || defaultCustomization.background.type,
      value: data.background?.value || defaultCustomization.background.value,
      angle: data.background?.angle,
      direction: data.background?.direction
    },
    font: {
      family: data.font?.family || defaultCustomization.font.family,
      size: data.font?.size || defaultCustomization.font.size,
      color: data.font?.color || defaultCustomization.font.color,
      weight: data.font?.weight,
      alignment: data.font?.alignment
    },
    buttons: {
      accept: {
        background: data.buttons?.accept?.background || defaultCustomization.buttons.accept.background,
        color: data.buttons?.accept?.color || defaultCustomization.buttons.accept.color,
        shape: data.buttons?.accept?.shape || defaultCustomization.buttons.accept.shape,
      },
      decline: {
        background: data.buttons?.decline?.background || defaultCustomization.buttons.decline.background,
        color: data.buttons?.decline?.color || defaultCustomization.buttons.decline.color,
        shape: data.buttons?.decline?.shape || defaultCustomization.buttons.decline.shape,
      }
    },
    headerStyle: data.headerStyle,
    headerImage: data.headerImage,
    animation: data.animation,
    cardEffect: data.cardEffect,
    branding: data.branding,
    enableChatbot: data.enableChatbot,
    enableAddToCalendar: data.enableAddToCalendar,
    showAcceptDeclineButtons: data.showAcceptDeclineButtons,
    showAddToCalendarButton: data.showAddToCalendarButton,
    utilityButtons: data.utilityButtons,
    elementAnimations: data.elementAnimations,
    mapDisplay: data.mapDisplay,
    poweredByColor: data.poweredByColor
  };
}

// Convert a raw event from the database to a typed Event object
export function convertToTypedEvent(rawEvent: any): Event | null {
  if (!rawEvent) return null;
  
  return {
    ...rawEvent,
    customization: convertToEventCustomization(rawEvent.customization)
  };
}

// Convert an array of raw events to typed Event objects
export function convertToTypedEvents(rawEvents: any[]): Event[] {
  if (!rawEvents || !Array.isArray(rawEvents)) return [];
  
  return rawEvents.map(event => convertToTypedEvent(event)).filter(Boolean) as Event[];
}
