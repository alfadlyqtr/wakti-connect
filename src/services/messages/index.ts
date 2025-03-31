
// Re-export all message service functions from a single entry point
export { getMessages as fetchMessages } from '../messages';
export { sendMessage } from '../messages';
export { markMessageAsRead } from '../messages';

// Export these functions from their respective files
export { fetchConversations } from './fetchConversations';
export { canMessageUser } from './permissionsService';
export { getUnreadMessagesCount } from './notificationsService';
