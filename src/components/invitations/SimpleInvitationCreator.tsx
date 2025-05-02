
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationForm from './InvitationForm';
import InvitationStyler from './InvitationStyler';
import { SimpleInvitation, BackgroundType } from '@/types/invitation.types';
import { createSimpleInvitation, updateSimpleInvitation } from '@/services/invitation/simple-invitations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import SimpleShareLink from './SimpleShareLink';

interface SimpleInvitationCreatorProps {
  existingInvitation?: SimpleInvitation;
  isEvent?: boolean;
}

export default function SimpleInvitationCreator({ existingInvitation, isEvent = false }: SimpleInvitationCreatorProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isPublic, setIsPublic] = useState<boolean>(existingInvitation?.isPublic || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fromName: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    locationTitle: '',
  });
  const [customization, setCustomization] = useState({
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
  });

  useEffect(() => {
    if (existingInvitation) {
      setFormData({
        title: existingInvitation.title || '',
        description: existingInvitation.description || '',
        fromName: existingInvitation.fromName || '',
        date: existingInvitation.date || '',
        time: existingInvitation.time || '',
        endTime: existingInvitation.endTime || '',
        location: existingInvitation.location || '',
        locationTitle: existingInvitation.locationTitle || '',
      });
      setCustomization(existingInvitation.customization);
      setIsPublic(existingInvitation.isPublic || false);
    }
  }, [existingInvitation]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomizationChange = (newCustomization: any) => {
    setCustomization(newCustomization);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get current user ID
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create invitations",
          variant: "destructive",
        });
        return;
      }
      
      // Validate required fields
      if (!formData.title) {
        toast({
          title: "Missing Information",
          description: "Please provide a title",
          variant: "destructive",
        });
        setActiveTab('details');
        return;
      }
      
      if (!formData.date) {
        toast({
          title: "Missing Information",
          description: "Please select a date",
          variant: "destructive",
        });
        setActiveTab('details');
        return;
      }
      
      // Convert date and time to ISO format
      const datetime = formData.date + (formData.time ? `T${formData.time}:00` : 'T00:00:00');
      const endTime = formData.date + (formData.endTime ? `T${formData.endTime}:00` : '');
      
      // Generate a unique share link for public invitations
      const shareLink = isPublic ? (existingInvitation?.shareId || Math.random().toString(36).substring(2, 10)) : null;
      
      // Prepare invitation data
      const invitationData = {
        title: formData.title,
        description: formData.description,
        from_name: formData.fromName,
        datetime,
        end_time: formData.endTime ? endTime : null,
        location: formData.location,
        location_title: formData.locationTitle,
        user_id: session.user.id,
        is_public: isPublic,
        share_link: shareLink,
        is_event: isEvent,
        background_type: customization.background.type,
        background_value: customization.background.value,
        font_family: customization.font.family,
        font_size: customization.font.size,
        text_color: customization.font.color,
        text_align: customization.font.alignment,
      };
      
      let result;
      
      // Update or create invitation
      if (existingInvitation) {
        result = await updateSimpleInvitation(existingInvitation.id, invitationData);
      } else {
        result = await createSimpleInvitation(invitationData);
      }
      
      if (result) {
        toast({
          title: `${isEvent ? 'Event' : 'Invitation'} ${existingInvitation ? 'Updated' : 'Created'}`,
          description: `Successfully ${existingInvitation ? 'updated' : 'created'} ${formData.title}`,
        });
        
        // Navigate back to the appropriate list
        navigate(isEvent ? '/dashboard/events' : '/dashboard/invitations');
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast({
        title: "Error",
        description: `Failed to ${existingInvitation ? 'update' : 'create'} ${isEvent ? 'event' : 'invitation'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {existingInvitation 
              ? `Edit ${isEvent ? 'Event' : 'Invitation'}`
              : `Create New ${isEvent ? 'Event' : 'Invitation'}`
            }
          </h1>
          <p className="text-muted-foreground">
            {isEvent 
              ? 'Create an event and invite others' 
              : 'Design a beautiful invitation for your guests'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(isEvent ? '/dashboard/events' : '/dashboard/invitations')}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (existingInvitation ? 'Update' : 'Create')}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{isEvent ? 'Event Details' : 'Invitation Details'}</CardTitle>
              <CardDescription>
                Fill in the information about your {isEvent ? 'event' : 'invitation'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <InvitationForm
                    formData={formData}
                    onChange={handleFormChange}
                    isEvent={isEvent}
                  />
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <label htmlFor="isPublic">Make this {isEvent ? 'event' : 'invitation'} public</label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Public {isEvent ? 'events' : 'invitations'} can be shared with anyone via a link
                    </p>
                  </div>
                  
                  {isPublic && existingInvitation && existingInvitation.shareId && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Share Link</h3>
                      <SimpleShareLink shareId={existingInvitation.shareId} />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="design">
                  <InvitationStyler
                    customization={customization}
                    onChange={handleCustomizationChange}
                    title={formData.title}
                    description={formData.description}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your {isEvent ? 'event' : 'invitation'} will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: 
                    customization.background.type === 'solid' 
                      ? customization.background.value 
                      : '#ffffff',
                  backgroundImage: 
                    customization.background.type === 'image' 
                      ? `url(${customization.background.value})` 
                      : undefined,
                  backgroundSize: 'cover',
                  color: customization.font.color,
                  fontFamily: customization.font.family,
                  textAlign: customization.font.alignment as any || 'left',
                }}
              >
                <h2 className="text-xl font-bold mb-2">{formData.title || "Your Invitation Title"}</h2>
                {formData.fromName && <p className="text-sm mb-4">From: {formData.fromName}</p>}
                {formData.description && <p className="mb-4">{formData.description}</p>}
                
                {formData.date && (
                  <div className="mb-2">
                    <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
                  </div>
                )}
                
                {formData.time && (
                  <div className="mb-2">
                    <strong>Time:</strong> {formData.time}{formData.endTime ? ` - ${formData.endTime}` : ''}
                  </div>
                )}
                
                {formData.location && (
                  <div className="mb-2">
                    <strong>Location:</strong> {formData.locationTitle || formData.location}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
