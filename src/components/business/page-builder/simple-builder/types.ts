
export type TextAlignment = 'left' | 'center' | 'right';
export type HeadingStyle = 'default' | 'serif' | 'modern' | 'minimal';
export type ButtonStyle = 'default' | 'outline' | 'minimal' | 'rounded';
export type SectionSpacing = 'compact' | 'default' | 'spacious';
export type LogoShape = 'circle' | 'square';

export interface SocialPlatforms {
  whatsapp: boolean;
  whatsappBusiness: boolean;
  facebook: boolean;
  instagram: boolean;
  googleMaps: boolean;
  phone: boolean;
  email: boolean;
}

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
  
  textAlignment?: TextAlignment;
  headingStyle?: HeadingStyle;
  buttonStyle?: ButtonStyle;
  sectionSpacing?: SectionSpacing;
  contentMaxWidth?: string;
}

export interface WorkingHour {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface BusinessPageData {
  pageSetup: {
    businessName: string;
    alignment: TextAlignment;
    visible: boolean;
    description?: string;
  };
  logo: {
    url: string;
    shape: LogoShape;
    alignment: string;
    visible: boolean;
  };
  bookings: {
    viewStyle: string;
    templates: any[];
    visible: boolean;
  };
  socialInline: {
    style: string;
    platforms: SocialPlatforms;
    visible: boolean;
  };
  workingHours: {
    layout: string;
    hours: WorkingHour[];
    visible: boolean;
  };
  chatbot: {
    position: string;
    embedCode: string;
    visible: boolean;
  };
  theme: {
    backgroundColor: string;
    textColor: string;
    fontStyle: string;
  };
  socialSidebar: {
    position: string;
    platforms: SocialPlatforms;
    visible: boolean;
  };
  contactInfo: Record<string, string>;
  sectionOrder: string[];
  published: boolean;
  sections?: SectionType[];
  pageUrl?: string;  // Added to track the full URL
  pageSlug?: string; // Added to track the custom slug
}

// Define a basic type for representing database business_pages_data table structure
export interface BusinessPageRecord {
  id?: string;
  user_id: string;
  page_data: any; // Will be JSON.stringify(BusinessPageData)
  page_slug?: string;
  created_at?: string;
  updated_at?: string;
}
