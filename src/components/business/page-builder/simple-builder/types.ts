
export type TextAlignment = 'left' | 'center' | 'right';
export type HeadingStyle = 'default' | 'serif' | 'modern' | 'minimal';
export type ButtonStyle = 'default' | 'outline' | 'minimal' | 'rounded';
export type SectionSpacing = 'compact' | 'default' | 'spacious';

export interface SectionType {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  content: Record<string, any>;
  activeLayout: string;
  image?: string;
  backgroundImageUrl?: string;
}

export interface PageSettings {
  title: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  isPublished: boolean;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  businessHours: Array<{
    day: string;
    hours: string;
    isOpen: boolean;
  }>;
  googleMapsUrl: string;
  tmwChatbotCode: string;
  
  // New properties to fix type errors
  textAlignment?: TextAlignment;
  headingStyle?: HeadingStyle;
  buttonStyle?: ButtonStyle;
  sectionSpacing?: SectionSpacing;
  contentMaxWidth?: string;
}
