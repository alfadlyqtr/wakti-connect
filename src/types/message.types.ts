
export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  senderAvatar?: string;
  type?: 'text' | 'voice' | 'image';
  audioUrl?: string;
  imageUrl?: string;
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

export type UserProfile = {
  id: string;
  full_name: string;
  display_name: string;
  avatar_url?: string;
};

export type StaffProfile = {
  id: string;
  name: string;
  profile_image_url?: string;
};

export function isUserProfile(profile: UserProfile | StaffProfile): profile is UserProfile {
  return 'full_name' in profile;
}
