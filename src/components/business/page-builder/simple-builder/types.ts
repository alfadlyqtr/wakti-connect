
export interface SectionType {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  content?: Record<string, any>;
  activeLayout?: string;
}

export interface PageSettings {
  title: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  isPublished: boolean;
  fontFamily?: string;
  textColor?: string;
  backgroundColor?: string;
  logo?: string;
  theme?: string;
  tmwChatbotCode?: string;
  googleMapsUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    whatsapp?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  businessHours?: Array<{
    day: string;
    hours: string;
    isOpen: boolean;
  }>;
}
