
import { EventCustomization } from "@/types/event.types";

export interface EventTemplate {
  id: string;
  name: string;
  type: 'wedding' | 'birthday' | 'graduation' | 'meeting' | 'party' | 'other';
  description: string;
  previewImage?: string;
  customization: EventCustomization;
}

export const eventTemplates: EventTemplate[] = [
  {
    id: 'wedding-classic',
    name: 'Classic Wedding',
    type: 'wedding',
    description: 'A classic, elegant wedding invitation',
    customization: {
      background: {
        type: 'color',
        value: '#f8f9fa'
      },
      font: {
        family: 'Playfair Display, serif',
        size: 'medium',
        color: '#333333'
      },
      buttons: {
        accept: {
          background: '#4CAF50',
          color: '#ffffff',
          shape: 'rounded'
        },
        decline: {
          background: '#f44336',
          color: '#ffffff',
          shape: 'rounded'
        }
      },
      headerStyle: 'banner',
      animation: 'fade',
      headerImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      branding: {
        slogan: 'Join us on our special day'
      },
      enableAddToCalendar: true
    }
  },
  {
    id: 'birthday-fun',
    name: 'Fun Birthday Party',
    type: 'birthday',
    description: 'A vibrant birthday party invitation',
    customization: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)'
      },
      font: {
        family: 'Montserrat, sans-serif',
        size: 'large',
        color: '#ffffff'
      },
      buttons: {
        accept: {
          background: '#4CAF50',
          color: '#ffffff',
          shape: 'pill'
        },
        decline: {
          background: '#f44336',
          color: '#ffffff',
          shape: 'pill'
        }
      },
      headerStyle: 'simple',
      animation: 'pop',
      enableChatbot: true,
      enableAddToCalendar: true
    }
  },
  {
    id: 'graduation-proud',
    name: 'Graduation Celebration',
    type: 'graduation',
    description: 'A proud graduation announcement',
    customization: {
      background: {
        type: 'color',
        value: '#0d47a1'
      },
      font: {
        family: 'Georgia, serif',
        size: 'medium',
        color: '#ffffff'
      },
      buttons: {
        accept: {
          background: '#ffeb3b',
          color: '#212121',
          shape: 'rounded'
        },
        decline: {
          background: '#e0e0e0',
          color: '#212121',
          shape: 'rounded'
        }
      },
      headerStyle: 'banner',
      animation: 'fade',
      enableAddToCalendar: true
    }
  },
  {
    id: 'family-gathering',
    name: 'Family Gathering',
    type: 'party',
    description: 'A warm family reunion invitation',
    customization: {
      background: {
        type: 'color',
        value: '#f5f5dc'
      },
      font: {
        family: 'Verdana, sans-serif',
        size: 'medium',
        color: '#5d4037'
      },
      buttons: {
        accept: {
          background: '#8d6e63',
          color: '#ffffff',
          shape: 'rounded'
        },
        decline: {
          background: '#bdbdbd',
          color: '#ffffff',
          shape: 'rounded'
        }
      },
      headerStyle: 'minimal',
      animation: 'slide',
      enableAddToCalendar: true
    }
  },
  {
    id: 'business-meeting',
    name: 'Business Meeting',
    type: 'meeting',
    description: 'A professional business meeting invitation',
    customization: {
      background: {
        type: 'color',
        value: '#ffffff'
      },
      font: {
        family: 'Arial, sans-serif',
        size: 'medium',
        color: '#212121'
      },
      buttons: {
        accept: {
          background: '#1976d2',
          color: '#ffffff',
          shape: 'square'
        },
        decline: {
          background: '#e0e0e0',
          color: '#212121',
          shape: 'square'
        }
      },
      headerStyle: 'simple',
      animation: 'fade',
      branding: {
        slogan: 'Let\'s discuss business opportunities'
      },
      enableChatbot: true,
      enableAddToCalendar: true
    }
  },
  {
    id: 'modern-conference',
    name: 'Modern Conference',
    type: 'meeting',
    description: 'A sleek and modern conference/event template',
    customization: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        direction: 'to-bottom-right'
      },
      font: {
        family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        size: 'medium',
        color: '#2d3748',
        weight: 'medium',
        alignment: 'center'
      },
      headerFont: {
        family: 'Montserrat, sans-serif',
        size: 'large',
        color: '#2c5282',
        weight: 'bold'
      },
      buttons: {
        accept: {
          background: '#3182ce',
          color: '#ffffff',
          shape: 'pill'
        },
        decline: {
          background: '#e53e3e',
          color: '#ffffff',
          shape: 'pill'
        }
      },
      headerStyle: 'banner',
      animation: 'slide',
      elementAnimations: {
        text: 'fade',
        buttons: 'pop',
        icons: 'slide',
        delay: 'staggered'
      },
      cardEffect: {
        type: 'gloss',
        borderRadius: 'large',
        border: true,
        borderColor: '#e2e8f0'
      },
      enableChatbot: true,
      enableAddToCalendar: true,
      showAcceptDeclineButtons: true,
      mapDisplay: 'both'
    }
  },
  {
    id: 'luxury-gala',
    name: 'Luxury Gala',
    type: 'party',
    description: 'An elegant gala or formal event invitation',
    customization: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(to right, #141e30, #243b55)',
        angle: 120,
        direction: 'to-bottom-right'
      },
      font: {
        family: 'Playfair Display, serif',
        size: 'medium',
        color: '#ffffff',
        weight: 'normal',
        alignment: 'center'
      },
      headerFont: {
        family: 'Playfair Display, serif',
        size: 'large',
        color: '#ffd700',
        weight: 'bold'
      },
      descriptionFont: {
        family: 'Georgia, serif',
        size: 'medium',
        color: '#e0e0e0',
        weight: 'normal'
      },
      dateTimeFont: {
        family: 'Georgia, serif',
        size: 'medium',
        color: '#ffd700',
        weight: 'medium'
      },
      buttons: {
        accept: {
          background: '#ffd700',
          color: '#000000',
          shape: 'pill'
        },
        decline: {
          background: 'rgba(255,255,255,0.2)',
          color: '#ffffff',
          shape: 'pill'
        }
      },
      headerStyle: 'banner',
      animation: 'fade',
      elementAnimations: {
        text: 'fade',
        buttons: 'slide',
        icons: 'pop',
        delay: 'staggered'
      },
      cardEffect: {
        type: 'gloss',
        borderRadius: 'medium',
        border: true,
        borderColor: '#ffd700'
      },
      showAcceptDeclineButtons: true,
      showAddToCalendarButton: true,
      branding: {
        slogan: 'An evening of elegance awaits'
      },
      mapDisplay: 'both'
    }
  }
];

export const getTemplatesByType = (type: string): EventTemplate[] => {
  if (type === 'all') return eventTemplates;
  return eventTemplates.filter(template => template.type === type);
};

export const getTemplateById = (id: string): EventTemplate | undefined => {
  return eventTemplates.find(template => template.id === id);
};
