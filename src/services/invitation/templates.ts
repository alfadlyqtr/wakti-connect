
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
    const { data, error } = await supabase
      .from('invitation_templates')
      .select('*');

    if (error) {
      throw error;
    }

    // Map the data to match the expected InvitationTemplate type
    return (data || []).map(template => ({
      id: template.id,
      name: template.name || '',
      previewImage: template.preview_image || '',
      defaultStyles: template.default_styles || {},
      customization: template.customization || {},
      isDefault: template.is_default || false,
      createdAt: template.created_at || ''
    }));
  } catch (error) {
    console.error("Error fetching invitation templates:", error);
    return [];
  }
};
