
export interface EventGuestResponse {
  id?: string;
  event_id?: string;
  invitation_id?: string; // Added to support responses for invitations
  name: string;
  response: 'accepted' | 'declined';
  created_at?: string;
}

export interface EventWithResponses {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  location_title?: string;
  sender_name?: string;
  guest_responses?: EventGuestResponse[];
}
