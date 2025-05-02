
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationData, InvitationDbRecord } from '../invitation-types';
import { mapDbRecordToSimpleInvitation } from '../utils/invitation-mappers';

/**
 * Create a simple invitation record
 */
export const createSimpleInvitation = async (invitationData: InvitationData): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .insert(invitationData)
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
    const { data, error } = await supabase
      .from('invitations')
      .update(invitationData)
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
