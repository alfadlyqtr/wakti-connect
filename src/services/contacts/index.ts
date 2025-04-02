import { supabase } from '@/lib/supabase';
import { getUserContacts, getContactRequests } from './contactQueries';
import { UserContact } from '@/types/invitation.types';

export { getUserContacts, getContactRequests } from './contactQueries';
export { searchUsers, checkContactRequest } from './contactSearch';

// Fetch contacts data
export const fetchContacts = async (): Promise<UserContact[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    return getUserContacts(session.user.id);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

// Fetch pending requests
export const fetchPendingRequests = async (): Promise<UserContact[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    return getContactRequests(session.user.id);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
};

// Send contact request
export const sendContactRequest = async (contactId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to send contact requests');
    }
    
    const { error } = await supabase
      .from('user_contacts')
      .insert({
        user_id: session.session.user.id,
        contact_id: contactId,
        status: 'pending'
      });
    
    if (error) {
      console.error('Error sending contact request:', error);
      
      // Check if it's a duplicate request
      if (error.code === '23505') {
        throw new Error('You have already sent a request to this user');
      }
      
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendContactRequest:', error);
    throw error;
  }
};

// Respond to a contact request
export const respondToContactRequest = async (requestId: string, accept: boolean): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to respond to contact requests');
    }
    
    const { error } = await supabase
      .from('user_contacts')
      .update({
        status: accept ? 'accepted' : 'rejected'
      })
      .eq('id', requestId)
      .eq('contact_id', session.session.user.id);
    
    if (error) {
      console.error('Error responding to contact request:', error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in respondToContactRequest:', error);
    throw error;
  }
};

// Sync staff-business contacts (ensures all staff within a business are connected)
export const syncStaffBusinessContacts = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to sync contacts');
    }
    
    // Call the database function that updates existing staff contacts
    const { error } = await supabase.rpc('update_existing_staff_contacts');
    
    if (error) {
      console.error('Error syncing staff-business contacts:', error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in syncStaffBusinessContacts:', error);
    throw error;
  }
};
