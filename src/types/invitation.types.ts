
export interface InvitationRecipient {
  type: 'email' | 'contact';
  id: string;
  status?: 'pending' | 'accepted' | 'declined';
}

export interface InvitationLink {
  id: string;
  link: string;
  expires_at?: string;
  uses_remaining?: number;
}
