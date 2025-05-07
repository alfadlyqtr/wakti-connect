
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
  backgroundImage?: string;
  textAlignment?: 'left' | 'center' | 'right';
  headingStyle?: 'default' | 'bold' | 'elegant' | 'modern';
  buttonStyle?: 'default' | 'rounded' | 'outline' | 'minimal';
  sectionSpacing?: 'compact' | 'default' | 'spacious';
  contentMaxWidth?: 'narrow' | 'default' | 'wide' | 'full';
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
