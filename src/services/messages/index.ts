
// Re-export all message service functions from a single entry point
export { getMessages } from '../messages';
export { sendMessage } from '../messages';
export { markMessageAsRead } from '../messages';

// These functions are in their own files
export { fetchConversations } from './fetchConversations';
export { canMessageUser } from './permissionsService';
export { getUnreadMessagesCount } from './notificationsService';
