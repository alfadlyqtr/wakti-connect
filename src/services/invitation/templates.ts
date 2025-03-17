
import { fromTable } from "@/integrations/supabase/helper";
import { InvitationTemplate } from "@/types/invitation.types";

/**
 * Fetch available invitation templates
 */
export const fetchInvitationTemplates = async (): Promise<InvitationTemplate[]> => {
  try {
    const { data, error } = await fromTable('invitation_templates')
      .select('*');

    if (error) {
      throw error;
    }

    return data.map(template => ({
      id: template.id,
      name: template.name,
      previewImage: template.preview_image,
      defaultStyles: template.default_styles,
      createdAt: template.created_at
    }));
  } catch (error) {
    console.error("Error fetching invitation templates:", error);
    return [];
  }
};
