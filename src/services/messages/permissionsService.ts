
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches permissions for a conversation or creates default permissions
 */
export const getConversationPermissions = async (conversationId: string) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Check if permissions already exist
    const { data: existingPermissions, error } = await supabase
      .from('conversation_permissions')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
    
    // Return existing permissions if found
    if (existingPermissions && existingPermissions.length > 0) {
      return existingPermissions[0];
    }
    
    // Create default permissions
    const defaultPermissions = {
      user_id: userId,
      conversation_id: conversationId,
      can_read: true,
      can_write: true,
      can_delete: true,
      is_owner: true
    };
    
    const { data: newPermissions, error: createError } = await supabase
      .from('conversation_permissions')
      .insert(defaultPermissions)
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating permissions:', createError);
      throw createError;
    }
    
    return newPermissions;
  } catch (error) {
    console.error('Error in permission service:', error);
    throw error;
  }
};

/**
 * Updates permissions for a conversation
 */
export const updatePermissions = async (conversationId: string, permissions: Partial<any>) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User not authenticated');
    }
    
    const userId = sessionData.session.user.id;
    
    // Only allow updating permissions if user is the owner
    const { data: ownerCheck, error: ownerError } = await supabase
      .from('conversation_permissions')
      .select('is_owner')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();
      
    if (ownerError || !ownerCheck?.is_owner) {
      throw new Error('Not authorized to update permissions');
    }
    
    const { error } = await supabase
      .from('conversation_permissions')
      .update(permissions)
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating permissions:', error);
    throw error;
  }
};
