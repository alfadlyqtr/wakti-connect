
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationData, InvitationDbRecord } from '../invitation-types';
import { mapDbRecordToSimpleInvitation } from '../utils/invitation-mappers';
import { generateEnhancedSlug } from '@/utils/string-utils';

/**
 * Create a simple invitation record
 */
export const createSimpleInvitation = async (invitationData: InvitationData): Promise<SimpleInvitation | null> => {
  try {
    // Get user profile to include display name in slug
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No authenticated session');
    }
    
    // Get user's display name from their profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('display_name, full_name')
      .eq('id', session.user.id)
      .single();
    
    // Get display name or full name to use in slug
    const displayName = userProfile?.display_name || userProfile?.full_name;
    
    // Generate enhanced slug with user info and title
    const slug = generateEnhancedSlug(session.user.id, displayName, invitationData.title);
    
    console.log('Generated enhanced slug:', slug);
    
    // Add the slug to the invitation data
    const dataWithSlug = {
      ...invitationData,
      share_link: slug
    };

    const { data, error } = await supabase
      .from('invitations')
      .insert(dataWithSlug)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbRecordToSimpleInvitation(data);
  } catch (error) {
    console.error("Error creating invitation:", error);
    toast({
      title: "Error",
      description: "Failed to create invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Update an existing invitation record
 */
export const updateSimpleInvitation = async (id: string, invitationData: Partial<InvitationData>): Promise<SimpleInvitation | null> => {
  try {
    // If title is being updated, regenerate the slug with user information
    let dataToUpdate = { ...invitationData };
    
    if (invitationData.title) {
      // Get user profile to include display name in slug
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }
      
      // Get user's display name from their profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('display_name, full_name')
        .eq('id', session.user.id)
        .single();
      
      // Get display name or full name to use in slug
      const displayName = userProfile?.display_name || userProfile?.full_name;
      
      // Generate enhanced slug with user info and title
      dataToUpdate.share_link = generateEnhancedSlug(session.user.id, displayName, invitationData.title);
      
      console.log('Updated enhanced slug:', dataToUpdate.share_link);
    }

    const { data, error } = await supabase
      .from('invitations')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbRecordToSimpleInvitation(data);
  } catch (error) {
    console.error("Error updating invitation:", error);
    toast({
      title: "Error",
      description: "Failed to update invitation",
      variant: "destructive",
    });
    return null;
  }
};
