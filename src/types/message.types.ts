
export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}
