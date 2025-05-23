
import { supabase } from '@/integrations/supabase/client';

// Re-export all invitation service functions for easy imports
export * from './templates';
export * from './customization';
export * from './simple-invitations';
export { 
  sendInvitation, 
  recallInvitation, 
  listSentInvitations,
  listReceivedInvitations 
} from './invitations';
// Export the responses functions with explicit renaming to avoid conflicts
export { respondToInvitation, getInvitationById } from './responses';
