
// Re-export all message service functions from a single entry point
export { fetchMessages } from './fetchMessages';
export { sendMessage } from './sendMessage';
export { fetchConversations } from './fetchConversations';
export { canMessageUser } from './permissionsService';
export { getUnreadMessagesCount } from './notificationsService';
