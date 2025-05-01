
import { supabase } from '@/integrations/supabase/client';
import { InvitationDbRecord, InvitationData, SimpleInvitationResult } from './invitation-types';
import { SimpleInvitation, BackgroundType, ButtonPosition } from '@/types/invitation.types';

/**
 * Map a database record to a SimpleInvitation object
 * Using explicit mapping to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;

  // Create a result object with explicit property assignments to break deep type inference chains
  const result: SimpleInvitationResult = {
    id: data.id,
    title: data.title,
    description: data.description || '',
    location: data.location || '',
    locationTitle: data.location_title || '',
    date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
    time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_id,
    isPublic: data.is_public || false,
    isEvent: !!data.is_event,
    customization: {
      background: {
        type: (data.background_type || 'solid') as BackgroundType,
        value: data.background_value || '#ffffff'
      },
      font: {
        family: data.font_family || 'system-ui, sans-serif',
        size: data.font_size || 'medium',
        color: data.text_color || '#000000',
        alignment: data.text_align || 'left',
      }
    }
  };

  // Add button configurations that match the interface requirements
  result.customization.buttons = {
    accept: {
      background: '#3B82F6',
      color: '#ffffff',
      shape: 'rounded',
    },
    decline: {
      background: '#EF4444',
      color: '#ffffff',
      shape: 'rounded',
    },
    directions: {
      show: !!data.location, // Show directions button if location exists
      background: '#3B82F6',
      color: '#ffffff',
      shape: 'rounded',
      position: 'bottom-right'
    },
    calendar: {
      show: !!data.is_event, // Show calendar button if it's an event
      background: '#3B82F6',
      color: '#ffffff',
      shape: 'rounded',
      position: 'bottom-left'
    }
  };

  // Use a type assertion instead of a complex type conversion
  return result as SimpleInvitation;
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
      .single();
      
    if (error) {
      console.error('[createSimpleInvitation] Error:', error);
      throw error;
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
      .single();
      
    if (error) {
      console.error('[updateSimpleInvitation] Error:', error);
      throw error;
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
      .single();
      
    if (error) {
      console.error('[getSimpleInvitationById] Error:', error);
      throw error;
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
      .single();
      
    if (error) {
      console.error('[getSharedInvitation] Error:', error);
      throw error;
    }
    
    console.log('[getSharedInvitation] Got shared invitation:', record);
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[getSharedInvitation] Error getting shared invitation:', error);
    return null;
  }
}

/**
 * Fetch all simple invitations for a user
 */
export async function fetchSimpleInvitations(userId: string, isEvent?: boolean): Promise<SimpleInvitation[]> {
  try {
    console.log(`[fetchSimpleInvitations] Fetching ${isEvent ? 'events' : 'invitations'} for user:`, userId);
    
    if (!userId) {
      console.warn('[fetchSimpleInvitations] No userId provided, returning empty array');
      return [];
    }
    
    // Start with the base query
    let query = supabase
      .from('invitations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    // Add event filter if specified
    if (isEvent !== undefined) {
      query = query.eq('is_event', isEvent);
    }
    
    const { data: records, error } = await query;
      
    if (error) {
      console.error('[fetchSimpleInvitations] Error:', error);
      throw error;
    }
    
    console.log('[fetchSimpleInvitations] Fetched invitations:', records?.length || 0);
    const invitations = records
      ?.map(record => mapDbRecordToSimpleInvitation(record as InvitationDbRecord))
      .filter(Boolean) as SimpleInvitation[];
      
    return invitations || [];
  } catch (error) {
    console.error('[fetchSimpleInvitations] Error fetching invitations:', error);
    return [];
  }
}
