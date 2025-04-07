
import { supabase } from '@/lib/supabase';
import { Event, EventFormData, EventStatus } from '@/types/event.types';
import { toast } from '@/components/ui/use-toast';
import { convertToTypedEvent } from '@/utils/typeAdapters';

// Helper function to get the current user
const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Update an existing event
export const updateEvent = async (eventId: string, formData: EventFormData): Promise<Event | null> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to update events.",
        variant: "destructive",
      });
      return null;
    }

    // Check if the user owns this event
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !event) {
      console.error("Error fetching event to update:", fetchError);
      toast({
        title: "Event Not Found",
        description: "Could not find the event to update or you don't have permission.",
        variant: "destructive",
      });
      return null;
    }

    // Format the event data for update
    let startTimestamp = formData.start_time;
    if (!startTimestamp && formData.startDate) {
      startTimestamp = new Date(formData.startDate).toISOString();
    }
    
    let endTimestamp = formData.end_time;
    if (!endTimestamp && formData.endDate) {
      endTimestamp = new Date(formData.endDate).toISOString();
    }
    
    // Type-safe status handling
    let statusValue: "accepted" | "declined" | "draft" | "sent" | "recalled" = "draft";
    
    switch(formData.status) {
      case "published":
      case "sent":
        statusValue = "sent";
        break;
      case "accepted":
        statusValue = "accepted";
        break;
      case "declined":
        statusValue = "declined";
        break;
      case "cancelled":
      case "recalled":
        statusValue = "recalled";
        break;
      default:
        statusValue = "draft";
    }
    
    // Convert customization to a serializable format
    const customizationJson = formData.customization ? JSON.stringify(formData.customization) : null;
    
    // Prepare the event object for update
    const eventData = {
      title: formData.title,
      description: formData.description,
      start_time: startTimestamp,
      end_time: endTimestamp,
      is_all_day: formData.isAllDay,
      location: formData.location,
      status: statusValue,
      customization: customizationJson
    };
    
    // Update the event
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();
    
    if (updateError) {
      console.error("Error updating event:", updateError);
      throw new Error(updateError.message);
    }
    
    // Handle invitations if provided
    if (formData.invitations && formData.invitations.length > 0) {
      // First, fetch existing invitations
      const { data: existingInvites, error: invitesError } = await supabase
        .from('event_invitations')
        .select('*')
        .eq('event_id', eventId);
        
      if (invitesError) {
        console.error("Error fetching existing invitations:", invitesError);
        // Continue anyway as we can still try to add new invitations
      }
      
      // Create a map of existing invites by email or user ID
      const existingInviteMap = new Map();
      if (existingInvites) {
        existingInvites.forEach(invite => {
          const key = invite.invited_user_id || invite.email;
          if (key) existingInviteMap.set(key, invite);
        });
      }
      
      // Prepare new invitations to add with proper typing
      const newInvitations = formData.invitations
        .filter(invite => {
          const key = invite.invited_user_id || invite.email;
          return key && !existingInviteMap.has(key);
        })
        .map(invite => ({
          event_id: eventId,
          email: invite.email,
          invited_user_id: invite.invited_user_id,
          status: (invite.status || 'pending') as 'pending' | 'accepted' | 'declined',
          shared_as_link: invite.shared_as_link || false
        }));
      
      // Add new invitations if any
      if (newInvitations.length > 0) {
        const { error: invitationError } = await supabase
          .from('event_invitations')
          .insert(newInvitations);
        
        if (invitationError) {
          console.warn("Error adding new invitations:", invitationError);
          toast({
            title: "Warning",
            description: "Event updated but there was an issue with some invitations",
            variant: "destructive",
          });
        }
      }
    }
    
    // Convert and return the updated event
    return convertToTypedEvent(updatedEvent);
    
  } catch (error: any) {
    console.error("Error in updateEvent:", error);
    toast({
      title: "Update Failed",
      description: error.message || "An unexpected error occurred while updating the event.",
      variant: "destructive",
    });
    return null;
  }
};
