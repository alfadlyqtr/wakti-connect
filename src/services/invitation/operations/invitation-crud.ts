
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationData, InvitationDbRecord } from '../invitation-types';
import { mapDbRecordToSimpleInvitation } from '../utils/invitation-mappers';
import { generateSlug } from '@/utils/string-utils';

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
    
    // Generate slug with user info and title
    const slug = generateCustomSlug(session.user.id, displayName, invitationData.title);
    
    console.log('Generated custom slug:', slug);
    
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
      
      // Generate slug with user info and title
      dataToUpdate.share_link = generateCustomSlug(session.user.id, displayName, invitationData.title);
      
      console.log('Updated custom slug:', dataToUpdate.share_link);
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

/**
 * Helper function to generate a custom slug with user information and title
 */
function generateCustomSlug(userId: string, displayName: string | null, title: string): string {
  // Create a base from display name or first part of userId if no display name
  const nameBase = displayName 
    ? generateSlug(displayName).substring(0, 15) 
    : userId.substring(0, 8);
  
  // Create a slug from the title
  const titleSlug = generateSlug(title).substring(0, 30);
  
  // Combine them with a unique timestamp to ensure uniqueness
  const timestamp = new Date().getTime().toString().substring(6, 10);
  
  return `${nameBase}-${titleSlug}-${timestamp}`;
}
