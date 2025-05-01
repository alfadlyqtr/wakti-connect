
// Re-export all invitation functions from invitation-crud and invitation-fetch
export {
  createSimpleInvitation,
  updateSimpleInvitation,
  getSimpleInvitationById,
  getSharedInvitation,
  mapDbRecordToSimpleInvitation
} from './invitation-crud';

export {
  fetchSimpleInvitations,
  listSimpleInvitations
} from './invitation-fetch';

// Import the supabase client
import { supabase } from '@/integrations/supabase/client';

/**
 * Deletes a simple invitation by ID
 * @param id The ID of the invitation to delete
 * @returns A boolean indicating success or failure
 */
export async function deleteSimpleInvitation(id: string): Promise<boolean> {
  try {
    console.log('[deleteSimpleInvitation] Deleting invitation:', id);
    
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('[deleteSimpleInvitation] Error:', error);
      throw error;
    }
    
    console.log('[deleteSimpleInvitation] Invitation deleted successfully');
    return true;
  } catch (error) {
    console.error('[deleteSimpleInvitation] Error deleting invitation:', error);
    return false;
  }
}
