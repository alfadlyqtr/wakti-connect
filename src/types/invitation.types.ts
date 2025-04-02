
// Types for the contacts system
export type ContactRequestStatus = "accepted" | "pending" | "rejected" | "none";

export interface ContactProfile {
  id: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  accountType: string | null;
  businessName?: string | null;
  email?: string | null;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  status: "accepted" | "pending" | "rejected";
  staffRelationId?: string | null;
  contactProfile: ContactProfile;
}

export interface UserSearchResult {
  id: string;
  fullName: string | null;
  displayName: string | null;
  email?: string | null;
  avatarUrl: string | null;
  accountType: string;
  businessName?: string | null;
}

export interface ContactRequestStatus {
  requestExists: boolean;
  requestStatus: "accepted" | "pending" | "rejected" | "none";
}
