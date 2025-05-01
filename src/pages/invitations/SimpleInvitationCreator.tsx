
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import SimpleCardEditor from '@/components/invitations/SimpleCardEditor';
import { useAuth } from '@/lib/auth';
import { SimpleInvitation, SimpleInvitationCustomization } from '@/types/invitation.types';
import { createSimpleInvitation } from '@/services/invitation/invitation-crud';

const SimpleInvitationCreator: React.FC = () => {
  const { user } = useAuth?.() || { user: null };
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState<Partial<SimpleInvitation>>({
    title: '',
    description: '',
    location: '',
    locationTitle: '',
    userId: user?.id || '',
    customization: {
      background: {
        type: 'solid',
        value: '#ffffff'
      },
      font: {
        family: 'system-ui, sans-serif',
        size: 'medium',
        color: '#000000',
        alignment: 'center',
      },
      buttons: {
        accept: {
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
        },
        decline: {
          background: '#EF4444',
          color: '#ffffff',
          shape: 'rounded',
        },
        directions: {
          show: false,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
          position: 'bottom-right'
        },
        calendar: {
          show: false,
          background: '#3B82F6',
          color: '#ffffff',
          shape: 'rounded',
          position: 'bottom-left'
        }
      },
      textLayout: {
        contentPosition: 'middle',
        spacing: 'normal'
      }
    }
  });

  const handleInvitationChange = (updatedInvitation: Partial<SimpleInvitation>) => {
    setInvitation({
      ...invitation,
      ...updatedInvitation
    });
  };

  const handleCustomizationChange = (customization: SimpleInvitationCustomization) => {
    setInvitation({
      ...invitation,
      customization
    });
  };

  const handleSaveDraft = async () => {
    try {
      if (!user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your invitation.",
          variant: "destructive"
        });
        return;
      }

      // Basic validation
      if (!invitation.title) {
        toast({
          title: "Required Field Missing",
          description: "Please add a title to your invitation.",
          variant: "destructive"
        });
        return;
      }

      const invitationData = {
        title: invitation.title || '',
        description: invitation.description || '',
        location: invitation.location || '',
        location_title: invitation.locationTitle || '',
        datetime: invitation.date ? `${invitation.date}T${invitation.time || '00:00'}` : null,
        background_type: invitation.customization.background.type,
        background_value: invitation.customization.background.value,
        font_family: invitation.customization.font.family,
        font_size: invitation.customization.font.size,
        text_color: invitation.customization.font.color,
        text_align: invitation.customization.font.alignment || 'center',
        is_event: true,
        user_id: user.id,
      };

      toast({
        title: "Saving Draft...",
        description: "Your invitation is being saved as a draft.",
      });

      const result = await createSimpleInvitation(invitationData);
      
      if (result) {
        toast({
          title: "Draft Saved",
          description: "Your invitation draft has been saved successfully.",
        });
        // Navigate to dashboard or stay on same page
      } else {
        throw new Error("Failed to save invitation draft");
      }
    } catch (error) {
      console.error("Error saving invitation draft:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your invitation draft.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your invitation.",
          variant: "destructive"
        });
        return;
      }

      // Basic validation
      if (!invitation.title) {
        toast({
          title: "Required Field Missing",
          description: "Please add a title to your invitation.",
          variant: "destructive"
        });
        return;
      }

      const invitationData = {
        title: invitation.title || '',
        description: invitation.description || '',
        location: invitation.location || '',
        location_title: invitation.locationTitle || '',
        datetime: invitation.date ? `${invitation.date}T${invitation.time || '00:00'}` : null,
        background_type: invitation.customization.background.type,
        background_value: invitation.customization.background.value,
        font_family: invitation.customization.font.family,
        font_size: invitation.customization.font.size,
        text_color: invitation.customization.font.color,
        text_align: invitation.customization.font.alignment || 'center',
        is_event: true,
        user_id: user.id,
        is_public: true,
      };

      toast({
        title: "Creating Invitation...",
        description: "Your invitation is being created.",
      });

      const result = await createSimpleInvitation(invitationData);
      
      if (result) {
        toast({
          title: "Invitation Created",
          description: "Your invitation has been created successfully.",
        });
        navigate('/dashboard/events');
      } else {
        throw new Error("Failed to create invitation");
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating your invitation.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Invitation</h1>
        <p className="text-muted-foreground">
          Design your invitation card with our simple drag-and-drop editor
        </p>
      </div>
      
      <SimpleCardEditor 
        invitation={invitation}
        onInvitationChange={handleInvitationChange}
        onCustomizationChange={handleCustomizationChange}
        onSaveDraft={handleSaveDraft}
        onSave={handleSave}
      />
    </div>
  );
};

export default SimpleInvitationCreator;
