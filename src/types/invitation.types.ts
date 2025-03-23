
export interface UserContactProfile {
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  email?: string;
  accountType?: string;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  staffRelationId?: string;
  contactProfile?: UserContactProfile;
}
