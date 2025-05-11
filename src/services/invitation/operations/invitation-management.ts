
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { mapDbRecordToSimpleInvitation } from '../utils/invitation-mappers';

/**
 * Get all invitations for the current user
 * @param isEventsList Filter to only show events if true
 */
export async function getSimpleInvitations(isEventsList: boolean = false): Promise<SimpleInvitation[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No authenticated session');
    }

    let query = supabase
      .from('invitations')
      .select('*')
      .eq('user_id', session.user.id);
    
    // For events query, also include items with dates regardless of is_event flag
    if (isEventsList) {
      query = query.or(`is_event.eq.true,datetime.not.is.null`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapDbRecordToSimpleInvitation).filter(Boolean) as SimpleInvitation[];
  } catch (error) {
    console.error("Error fetching invitations:", error);
    toast({
      title: "Error",
      description: "Failed to fetch invitations",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Delete a simple invitation by ID
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
    toast({
      title: "Error",
      description: "Failed to delete invitation",
      variant: "destructive",
    });
    return false;
  }
}
