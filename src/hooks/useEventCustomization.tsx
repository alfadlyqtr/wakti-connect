
import { useState } from 'react';
import { EventCustomization } from '@/types/event.types';

// Default customization for new events
export const defaultCustomization: EventCustomization = {
  background: {
    type: "solid",
    value: "#f3f4f6",
  },
  font: {
    family: "Inter",
    size: "1rem",
    color: "#374151",
    weight: "normal",
    alignment: "left",
  },
  headerFont: {
    family: "Inter",
    size: "1.5rem",
    color: "#111827",
    weight: "medium",
  },
  descriptionFont: {
    family: "Inter", 
    size: "0.875rem",
    color: "#6b7280",
    weight: "normal",
  },
  dateTimeFont: {
    family: "Inter",
    size: "1rem",
    color: "#374151",
    weight: "normal",
  },
  buttons: {
    accept: {
      background: "#4f46e5",
      color: "#ffffff",
      shape: "rounded",
    },
    decline: {
      background: "#ef4444",
      color: "#ffffff",
      shape: "rounded",
    },
  },
  utilityButtons: {
    calendar: {
      background: "#4f46e5",
      color: "#ffffff",
      shape: "rounded",
    },
    map: {
      background: "#4f46e5",
      color: "#ffffff",
      shape: "rounded",
    },
  },
  headerStyle: "simple" as "simple" | "banner" | "minimal", // Fixed type here
  showAcceptDeclineButtons: true,
  showAddToCalendarButton: true,
  enableAddToCalendar: true,
  cardEffect: {
    type: "shadow",
    borderRadius: "medium",
    border: false,
    borderColor: "#e5e7eb",
  },
  animation: "fade",
  elementAnimations: {
    text: "fade",
    buttons: "fade",
    icons: "fade",
    delay: "none",
  },
  mapDisplay: "button",
  poweredByColor: "#6b7280",
};

export const useEventCustomization = (initialCustomization?: EventCustomization) => {
  const [customization, setCustomization] = useState<EventCustomization>(
    initialCustomization || defaultCustomization
  );

  const updateCustomization = (updates: Partial<EventCustomization>) => {
    setCustomization(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return {
    customization,
    setCustomization,
    updateCustomization,
  };
};
