
import { EventCustomization } from "@/types/event.types";

// Interfaces for event templates
export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  customization: EventCustomization;
  isPremium: boolean;
}

// Default event templates
export const eventTemplates: EventTemplate[] = [
  {
    id: "template-1",
    name: "Minimal White",
    description: "Clean, simple white template with minimal design",
    previewImageUrl: "/images/templates/minimal-white.jpg",
    customization: {
      background: {
        type: "solid",
        value: "#ffffff"
      },
      font: {
        family: "Inter, sans-serif",
        size: "medium",
        color: "#333333",
        weight: "normal",
        alignment: "left"
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
      headerStyle: "minimal",
      animation: "fade"
    },
    isPremium: false
  },
  {
    id: "template-2",
    name: "Purple Theme",
    description: "Vibrant purple design with modern typography",
    previewImageUrl: "/images/templates/gradient-purple.jpg",
    customization: {
      background: {
        type: "solid",
        value: "#6366f1"
      },
      font: {
        family: "Poppins, sans-serif",
        size: "medium",
        color: "#ffffff",
        weight: "normal",
        alignment: "center"
      },
      buttons: {
        accept: {
          background: "#10B981",
          color: "#ffffff",
          shape: "pill"
        },
        decline: {
          background: "#EF4444",
          color: "#ffffff",
          shape: "pill"
        }
      },
      headerStyle: "banner",
      animation: "slide"
    },
    isPremium: false
  },
  {
    id: "template-3",
    name: "Business Blue",
    description: "Professional blue theme perfect for corporate events",
    previewImageUrl: "/images/templates/business-blue.jpg",
    customization: {
      background: {
        type: "solid",
        value: "#f8fafc"
      },
      font: {
        family: "system-ui, sans-serif",
        size: "medium",
        color: "#1e293b",
        weight: "normal",
        alignment: "left"
      },
      buttons: {
        accept: {
          background: "#0284c7",
          color: "#ffffff",
          shape: "rounded"
        },
        decline: {
          background: "#64748b",
          color: "#ffffff",
          shape: "rounded"
        }
      },
      headerStyle: "simple",
      headerImage: "/images/templates/business-header.jpg",
      animation: "fade"
    },
    isPremium: false
  },
  {
    id: "template-4",
    name: "Dark Mode",
    description: "Sleek dark theme with modern accents",
    previewImageUrl: "/images/templates/dark-mode.jpg",
    customization: {
      background: {
        type: "solid",
        value: "#1e293b"
      },
      font: {
        family: "Inter, sans-serif",
        size: "medium",
        color: "#e2e8f0",
        weight: "normal",
        alignment: "left"
      },
      buttons: {
        accept: {
          background: "#22c55e",
          color: "#ffffff",
          shape: "rounded"
        },
        decline: {
          background: "#ef4444",
          color: "#ffffff",
          shape: "rounded"
        }
      },
      headerStyle: "minimal",
      animation: "slide"
    },
    isPremium: true
  },
  {
    id: "template-5",
    name: "Sunset Theme",
    description: "Warm sunset colors with elegant design",
    previewImageUrl: "/images/templates/sunset-gradient.jpg",
    customization: {
      background: {
        type: "solid",
        value: "#f59e0b"
      },
      font: {
        family: "Montserrat, sans-serif",
        size: "medium",
        color: "#ffffff",
        weight: "normal",
        alignment: "center"
      },
      buttons: {
        accept: {
          background: "#ffffff",
          color: "#ef4444",
          shape: "pill"
        },
        decline: {
          background: "rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          shape: "pill"
        }
      },
      headerStyle: "banner",
      animation: "pop",
      cardEffect: {
        type: "shadow",
        borderRadius: "medium",
        border: false
      }
    },
    isPremium: true
  }
];

// Helper function to get a template by ID
export const getTemplateById = (id: string): EventTemplate | undefined => {
  return eventTemplates.find(template => template.id === id);
};

// Helper function to get all available templates
export const getAllTemplates = (): EventTemplate[] => {
  return eventTemplates;
};

// Helper function to get free templates only
export const getFreeTemplates = (): EventTemplate[] => {
  return eventTemplates.filter(template => !template.isPremium);
};

// Helper function to get premium templates only
export const getPremiumTemplates = (): EventTemplate[] => {
  return eventTemplates.filter(template => template.isPremium);
};
