
import { supabase } from "@/integrations/supabase/client";
import { InvitationTemplate } from "@/types/invitation.types";

// Define a default template structure to avoid TypeScript errors
const defaultTemplate: Omit<InvitationTemplate, 'id'> = {
  name: '',
  content: '',
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
        customization: { 
          theme: {
            primary: '#3B82F6',
            secondary: '#10B981',
            background: '#ffffff'
          },
          font: {
            family: 'system-ui, sans-serif',
            size: 'medium',
            color: '#000000'
          }
        },
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Elegant Invitation',
        previewImage: '/templates/elegant.jpg',
        defaultStyles: { backgroundColor: '#f8f5f2', textColor: '#333333' },
        customization: { 
          theme: {
            primary: '#9333EA',
            secondary: '#8B5CF6',
            background: '#f8f5f2'
          },
          font: {
            family: 'Georgia, serif',
            size: 'medium',
            color: '#333333'
          }
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Modern Invitation',
        previewImage: '/templates/modern.jpg',
        defaultStyles: { backgroundColor: '#121212', textColor: '#ffffff' },
        customization: { 
          theme: {
            primary: '#EC4899',
            secondary: '#8B5CF6',
            background: '#121212'
          },
          font: {
            family: 'Inter, sans-serif',
            size: 'medium',
            color: '#ffffff'
          }
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error("Error fetching invitation templates:", error);
    return [];
  }
};
