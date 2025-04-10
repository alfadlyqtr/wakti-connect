
// Export all message service functions from a unified entry point
export { sendMessage } from './sendMessage';
export { markMessageAsRead } from './markMessageAsRead';
export { getMessages } from './getMessages';
export { getUnreadMessagesCount, markConversationAsRead } from './notificationsService';
export { canMessageUser } from './permissionsService';
export { fetchConversations } from './fetchConversations';
