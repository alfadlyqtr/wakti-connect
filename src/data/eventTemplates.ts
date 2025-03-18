
import { EventCustomization } from "@/types/event.types";

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // URL to preview image
  customization: EventCustomization;
  type?: string; // Adding type property for filtering
}

const eventTemplates: EventTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design with minimal styling",
    preview: "/templates/minimal.jpg",
    customization: {
      background: {
        type: "color",
        value: "#ffffff"
      },
      font: {
        family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        size: "medium",
        color: "#333333",
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
      headerStyle: "simple",
      animation: "fade"
    },
    type: "other"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with gradient background",
    preview: "/templates/modern.jpg",
    customization: {
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      },
      font: {
        family: "Helvetica, sans-serif",
        size: "medium",
        color: "#333333",
        alignment: "center"
      },
      buttons: {
        accept: {
          background: "#3498db",
          color: "#ffffff",
          shape: "pill"
        },
        decline: {
          background: "#e74c3c",
          color: "#ffffff",
          shape: "pill"
        }
      },
      headerStyle: "simple",
      animation: "fade"
    },
    type: "meeting"
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong colors with impactful design",
    preview: "/templates/bold.jpg",
    customization: {
      background: {
        type: "color",
        value: "#2c3e50"
      },
      font: {
        family: "Impact, sans-serif",
        size: "large",
        color: "#ffffff",
        alignment: "center"
      },
      buttons: {
        accept: {
          background: "#2ecc71",
          color: "#ffffff",
          shape: "square"
        },
        decline: {
          background: "#e74c3c",
          color: "#ffffff",
          shape: "square"
        }
      },
      headerStyle: "banner",
      animation: "slide"
    },
    type: "party"
  },
  {
    id: "playful",
    name: "Playful",
    description: "Fun, colorful design for casual events",
    preview: "/templates/playful.jpg",
    customization: {
      background: {
        type: "gradient",
        value: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)"
      },
      font: {
        family: "Comic Sans MS, cursive",
        size: "medium",
        color: "#333333",
        alignment: "center"
      },
      buttons: {
        accept: {
          background: "#00b894",
          color: "#ffffff",
          shape: "rounded"
        },
        decline: {
          background: "#d63031",
          color: "#ffffff",
          shape: "rounded"
        }
      },
      headerStyle: "minimal",
      animation: "pop"
    },
    type: "birthday"
  },
  {
    id: "formal",
    name: "Formal",
    description: "Elegant design for professional events",
    preview: "/templates/formal.jpg",
    customization: {
      background: {
        type: "color",
        value: "#f8f9fa"
      },
      font: {
        family: "Georgia, serif",
        size: "medium",
        color: "#212529",
        alignment: "left"
      },
      buttons: {
        accept: {
          background: "#343a40",
          color: "#ffffff",
          shape: "rounded"
        },
        decline: {
          background: "#6c757d",
          color: "#ffffff",
          shape: "rounded"
        }
      },
      headerStyle: "simple",
      animation: "fade"
    },
    type: "graduation"
  },
  {
    id: "luxury",
    name: "Luxury Gala",
    description: "Elegant design for upscale events and galas",
    preview: "/templates/luxury.jpg",
    customization: {
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #2c3e50 0%, #4a5568 50%, #2c3e50 100%)",
        angle: 135,
        direction: "to-bottom-right"
      },
      font: {
        family: "Georgia, serif",
        size: "medium",
        color: "#e2e8f0",
        alignment: "center",
        weight: "normal"
      },
      headerFont: {
        family: "Times New Roman, serif",
        size: "large",
        color: "#efd79f", // Gold color
        weight: "bold"
      },
      descriptionFont: {
        family: "Georgia, serif",
        size: "medium",
        color: "#e2e8f0",
        weight: "normal"
      },
      dateTimeFont: {
        family: "Georgia, serif",
        size: "medium",
        color: "#efd79f", // Gold color
        weight: "medium"
      },
      buttons: {
        accept: {
          background: "#efd79f", // Gold
          color: "#2c3e50",
          shape: "pill"
        },
        decline: {
          background: "#2c3e50",
          color: "#e2e8f0",
          shape: "pill"
        }
      },
      headerStyle: "banner",
      animation: "fade", // Changed from "scale" to "fade" to match allowed types
      branding: {
        slogan: "Luxury Event Experience"
      },
      cardEffect: {
        type: "gloss",
        borderRadius: "medium",
        border: true,
        borderColor: "#efd79f"
      },
      elementAnimations: {
        text: "fade",
        buttons: "fade", // Changed from "scale" to "fade" to match allowed types
        icons: "fade",
        delay: "staggered"
      },
      mapDisplay: "both",
      showAcceptDeclineButtons: true,
      showAddToCalendarButton: true
    },
    type: "wedding"
  }
];

export function getTemplates(): EventTemplate[] {
  return eventTemplates;
}

export function getTemplateById(id: string): EventTemplate | undefined {
  return eventTemplates.find(template => template.id === id);
}
