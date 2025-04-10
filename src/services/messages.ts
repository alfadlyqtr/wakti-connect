
// This file re-exports all message service functions from their individual modules
// for backward compatibility with existing imports

export {
  sendMessage,
  markMessageAsRead,
  getMessages,
  getUnreadMessagesCount,
  markConversationAsRead,
  canMessageUser
} from './messages/index';

// Re-export fetchConversations directly to preserve existing import paths
export { fetchConversations } from './messages/fetchConversations';
