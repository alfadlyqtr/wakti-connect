
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
}
