
import { createContext, useContext } from "react";

export interface SocialPlatforms {
  whatsapp: boolean;
  whatsappBusiness: boolean;
  facebook: boolean;
  instagram: boolean;
  googleMaps: boolean;
  phone: boolean;
  email: boolean;
}

export type TextAlignment = 'left' | 'center' | 'right';
export type LogoShape = 'square' | 'circle';
export type ViewStyle = 'grid' | 'dropdown';
export type SocialStyle = 'icon' | 'button';
export type LayoutOption = 'card' | 'line';
export type Position = 'left' | 'right';
export type FontStyle = 'sans-serif' | 'serif' | 'monospace';

export interface PageSection {
  visible: boolean;
}

export interface PageSetup extends PageSection {
  businessName: string;
  alignment: TextAlignment;
}

export interface Logo extends PageSection {
  url: string;
  shape: LogoShape;
  alignment: TextAlignment;
}

export interface BookingTemplate {
  id: string;
  name: string;
}

export interface Bookings extends PageSection {
  viewStyle: ViewStyle;
  templates: BookingTemplate[];
}

export interface SocialInline extends PageSection {
  style: SocialStyle;
  platforms: SocialPlatforms;
}

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface WorkingHours extends PageSection {
  layout: LayoutOption;
  hours: WorkingHour[];
}

export interface Chatbot extends PageSection {
  position: Position;
  embedCode: string;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  fontStyle: FontStyle;
}

export interface SocialSidebar extends PageSection {
  position: Position;
  platforms: SocialPlatforms;
}

export interface ContactInfo {
  email: string;
  whatsapp: string;
  whatsappBusiness: string;
  phone: string;
  facebook: string;
  googleMaps: string;
  instagram: string;
}

export interface BusinessPageData {
  pageSetup: PageSetup;
  logo: Logo;
  bookings: Bookings;
  socialInline: SocialInline;
  workingHours: WorkingHours;
  chatbot: Chatbot;
  theme: Theme;
  socialSidebar: SocialSidebar;
  contactInfo: ContactInfo;
  sectionOrder: string[];
  published: boolean;
}

export interface BusinessPageContextType {
  pageData: BusinessPageData;
  updatePageData: (data: Partial<BusinessPageData>) => void;
  updateSectionData: <K extends keyof BusinessPageData>(
    section: K,
    data: Partial<BusinessPageData[K]>
  ) => void;
  saveStatus: 'saved' | 'unsaved' | 'saving';
  handleSave: () => Promise<void>;
}

export const BusinessPageContext = createContext<BusinessPageContextType | undefined>(undefined);

export const useBusinessPage = () => {
  const context = useContext(BusinessPageContext);
  if (context === undefined) {
    throw new Error("useBusinessPage must be used within a BusinessPageProvider");
  }
  return context;
};
