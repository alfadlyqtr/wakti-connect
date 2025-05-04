
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { createSimpleInvitation, updateSimpleInvitation } from '@/services/invitation/simple-invitations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationForm from './InvitationForm';
import InvitationStyler from './InvitationStyler';
import InvitationPreview from './InvitationPreview';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/features/auth/context/AuthContext';

interface SimpleInvitationCreatorProps {
  existingInvitation?: SimpleInvitation;
  onSuccess?: () => void;
  isEvent?: boolean;
}

export default function SimpleInvitationCreator({ 
  existingInvitation, 
  onSuccess,
  isEvent = false 
}: SimpleInvitationCreatorProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine paths based on whether this is for events or invitations
  const basePath = isEvent ? '/dashboard/events' : '/dashboard/invitations';
  const entityType = isEvent ? 'Event' : 'Invitation';

  const [formData, setFormData] = useState({
    title: existingInvitation?.title || '',
    description: existingInvitation?.description || '',
    location: existingInvitation?.location || '',
    locationTitle: existingInvitation?.locationTitle || '',
    date: existingInvitation?.date || '',
    time: existingInvitation?.time || '',
  });

  const [customization, setCustomization] = useState<SimpleInvitationCustomization>(
    existingInvitation?.customization || {
      background: {
        type: 'solid' as BackgroundType,
        value: '#ffffff',
      },
      font: {
        family: 'system-ui, sans-serif',
        size: 'medium',
        color: '#000000',
        alignment: 'left',
      },
    }
  );

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomizationChange = (newCustomization: SimpleInvitationCustomization) => {
    setCustomization(newCustomization);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save your ' + entityType.toLowerCase(),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Map our form data to the database structure
      const invitationData = {
        title: formData.title,
        description: formData.description || '',
        location: formData.location || '',
        location_url: formData.location || '', // Using location as location_url
        location_title: formData.locationTitle || '',
        datetime: formData.date && formData.time ? new Date(`${formData.date}T${formData.time}`).toISOString() : undefined,
        
        // Map from our customization model to the database fields
        background_type: customization.background.type,
        background_value: customization.background.value,
        font_family: customization.font.family,
        font_size: customization.font.size,
        font_color: customization.font.color,
        text_color: customization.font.color, // Add the required text_color property
        text_align: customization.font.alignment || 'left', // Add text_align property
        is_event: isEvent, // Add flag to identify if this is an event
        user_id: user.id, // Add the user's ID to comply with RLS
      };

      let result;
      if (existingInvitation) {
        // Update existing invitation
        result = await updateSimpleInvitation(existingInvitation.id, invitationData);
      } else {
        // Create new invitation
        result = await createSimpleInvitation(invitationData);
      }

      if (result) {
        toast({
          title: 'Success',
          description: `${entityType} successfully ${existingInvitation ? 'updated' : 'created'}!`,
        });
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(basePath);
        }
      }
    } catch (error) {
      console.error(`Error saving ${entityType.toLowerCase()}:`, error);
      toast({
        title: `Failed to save ${entityType.toLowerCase()}`,
        description: `There was an error while saving your ${entityType.toLowerCase()}.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab === 'details') {
      setActiveTab('customize');
    } else if (activeTab === 'customize') {
      handleSubmit();
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'customize') {
      setActiveTab('details');
    }
  };

  // Check if user is authenticated
  React.useEffect(() => {
    if (!user) {
      console.warn('User is not authenticated');
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {existingInvitation 
            ? `Edit ${entityType}` 
            : `Create New ${entityType}`}
        </h1>
        <p className="text-muted-foreground">
          {existingInvitation 
            ? `Update your ${entityType.toLowerCase()} details and styling` 
            : `Fill in the details and customize your ${entityType.toLowerCase()}`}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{entityType} Details</TabsTrigger>
          <TabsTrigger value="customize">Customize Style</TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TabsContent value="details" className="mt-0">
                <InvitationForm 
                  formData={formData}
                  onChange={handleFormChange}
                  isEvent={isEvent}
                />
              </TabsContent>

              <TabsContent value="customize" className="mt-0">
                <InvitationStyler
                  customization={customization}
                  onChange={handleCustomizationChange}
                  title={formData.title}
                  description={formData.description}
                />
              </TabsContent>
            </div>

            <div className="order-first md:order-last mb-6 md:mb-0">
              <div className="sticky top-4">
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Preview</h3>
                <InvitationPreview
                  title={formData.title}
                  description={formData.description}
                  location={formData.location}
                  locationTitle={formData.locationTitle}
                  date={formData.date}
                  time={formData.time}
                  customization={customization}
                  isEvent={isEvent}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => navigate(basePath)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              {activeTab === 'customize' && (
                <Button variant="outline" onClick={handlePrevTab} disabled={isSubmitting}>
                  Previous
                </Button>
              )}
              <Button onClick={handleNextTab} disabled={isSubmitting}>
                {activeTab === 'details' 
                  ? 'Next: Customize' 
                  : `Save ${entityType}`}
              </Button>
            </div>
          </div>
        </Card>
      </Tabs>
    </div>
  );
}
