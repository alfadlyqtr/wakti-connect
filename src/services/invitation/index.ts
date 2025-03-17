
// Re-export all invitation service functions for easy imports
export * from './templates';
export * from './customization';
export { 
  sendInvitation, 
  deleteInvitation, 
  getUserInvitations 
} from './invitations';
// Export the responses functions with explicit renaming to avoid conflicts
export { respondToInvitation as respondToInvitationUpdate } from './responses';
