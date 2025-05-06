
export type SectionType = {
  type: string;
  title: string;
  subtitle: string;
  image?: string;
  layouts: string[];
  activeLayout: string;
  content: Record<string, any>;
};

export type PageSettings = {
  title: string;
  theme: string;
  primaryColor: string;
  fontFamily: string;
  businessHours: BusinessHour[];
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  googleMapsUrl: string;
  tmwChatbotCode: string;
};

export type BusinessHour = {
  day: string;
  hours: string;
  isOpen: boolean;
};

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
};

export type SocialLinks = {
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
};
