
import { supabase } from "@/integrations/supabase/client";
import { InvitationTemplate } from "@/types/invitation.types";

// Define a default template structure to avoid TypeScript errors
const defaultTemplate: Omit<InvitationTemplate, 'id'> = {
  name: '',
  previewImage: '',
  defaultStyles: {},
  customization: {},
  isDefault: false,
  createdAt: ''
};

/**
 * Fetch available invitation templates
 */
export const fetchInvitationTemplates = async (): Promise<InvitationTemplate[]> => {
  try {
    // Return mock data instead of trying to access a non-existent table
    // This simulates templates while avoiding database errors
    return [
      {
        id: '1',
        name: 'Simple Invitation',
        previewImage: '/templates/simple.jpg',
        defaultStyles: { backgroundColor: '#ffffff', textColor: '#000000' },
        customization: { allowColors: true, allowFonts: true },
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Elegant Invitation',
        previewImage: '/templates/elegant.jpg',
        defaultStyles: { backgroundColor: '#f8f5f2', textColor: '#333333' },
        customization: { allowColors: true, allowFonts: true },
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Modern Invitation',
        previewImage: '/templates/modern.jpg',
        defaultStyles: { backgroundColor: '#121212', textColor: '#ffffff' },
        customization: { allowColors: true, allowFonts: true },
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error("Error fetching invitation templates:", error);
    return [];
  }
};
