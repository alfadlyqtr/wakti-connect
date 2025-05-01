
import { supabase } from '@/integrations/supabase/client';
import { InvitationDbRecord, InvitationData } from './invitation-types';
import { SimpleInvitation } from '@/types/invitation.types';

/**
 * Maps a database record to a SimpleInvitation object with simplified type handling
 */
export function mapDbRecordToSimpleInvitation(record: InvitationDbRecord): SimpleInvitation {
  // Convert datetime string to date and time
  let date: string | undefined;
  let time: string | undefined;
  
  if (record.datetime) {
    const dateObj = new Date(record.datetime);
    date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    time = dateObj.toISOString().split('T')[1].substring(0, 5); // HH:MM format
  }
  
  // Create the SimpleInvitation without complex type checking
  return {
    id: record.id,
    title: record.title,
    description: record.description || '',
    location: record.location || '',
    locationTitle: record.location_title || '',
    date,
    time,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    userId: record.user_id,
    shareId: record.share_id,
    isPublic: record.is_public,
    isEvent: record.is_event,
    customization: {
      background: {
        type: (record.background_type || 'solid') as 'solid' | 'gradient' | 'image' | 'ai',
        value: record.background_value || '#ffffff'
      },
      font: {
        family: record.font_family || 'system-ui, sans-serif',
        size: record.font_size || 'medium',
        color: record.text_color || '#000000',
        alignment: record.text_align || 'center'
      },
      buttons: {
        accept: {
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded'
        },
        decline: {
          background: '#EF4444',
          color: '#ffffff',
          shape: 'rounded'
        },
        directions: {
          show: true,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
          position: 'bottom-right'
        },
        calendar: {
          show: true,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
          position: 'bottom-left'
        }
      },
      textLayout: {
        contentPosition: 'middle',
        spacing: 'normal'
      }
    }
  };
}

/**
 * Create a new simple invitation
 */
export async function createSimpleInvitation(data: InvitationData): Promise<SimpleInvitation | null> {
  try {
    console.log('[createSimpleInvitation] Creating invitation with data:', data);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .insert([data])
      .select('*')
      .maybeSingle();
      
    if (error) {
      console.error('[createSimpleInvitation] Error:', error);
      throw error;
    }
    
    if (!record) {
      console.error('[createSimpleInvitation] No record returned after insert');
      return null;
    }
    
    console.log('[createSimpleInvitation] Created invitation:', record);
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[createSimpleInvitation] Error creating invitation:', error);
    return null;
  }
}

/**
 * Update an existing simple invitation
 */
export async function updateSimpleInvitation(id: string, data: Partial<InvitationData>): Promise<SimpleInvitation | null> {
  try {
    console.log('[updateSimpleInvitation] Updating invitation:', id, data);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .update(data)
      .eq('id', id)
      .select('*')
      .maybeSingle();
      
    if (error) {
      console.error('[updateSimpleInvitation] Error:', error);
      throw error;
    }
    
    if (!record) {
      console.error('[updateSimpleInvitation] No record found with id:', id);
      return null;
    }
    
    console.log('[updateSimpleInvitation] Updated invitation:', record);
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[updateSimpleInvitation] Error updating invitation:', error);
    return null;
  }
}

/**
 * Get a simple invitation by ID
 */
export async function getSimpleInvitationById(id: string): Promise<SimpleInvitation | null> {
  try {
    console.log('[getSimpleInvitationById] Getting invitation:', id);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('[getSimpleInvitationById] Error:', error);
      throw error;
    }
    
    if (!record) {
      console.error('[getSimpleInvitationById] No record found with id:', id);
      return null;
    }
    
    console.log('[getSimpleInvitationById] Got invitation:', record);
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[getSimpleInvitationById] Error getting invitation:', error);
    return null;
  }
}

/**
 * Get a shared invitation by its share ID
 */
export async function getSharedInvitation(shareId: string): Promise<SimpleInvitation | null> {
  try {
    console.log('[getSharedInvitation] Getting shared invitation:', shareId);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_id', shareId)
      .maybeSingle();
      
    if (error) {
      console.error('[getSharedInvitation] Error:', error);
      throw error;
    }
    
    if (!record) {
      console.error('[getSharedInvitation] No record found with share_id:', shareId);
      return null;
    }
    
    console.log('[getSharedInvitation] Got shared invitation:', record);
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[getSharedInvitation] Error getting shared invitation:', error);
    return null;
  }
}
