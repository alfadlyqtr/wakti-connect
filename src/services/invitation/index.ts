
import { supabase } from '@/lib/supabase';

// Re-export all invitation service functions for easy imports
export * from './templates';
export * from './customization';
export { 
  sendInvitation, 
  recallInvitation, 
  listSentInvitations,
  listReceivedInvitations 
} from './invitations';
// Export the responses functions with explicit renaming to avoid conflicts
export { respondToInvitation, getInvitationById } from './responses';
