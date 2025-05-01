
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import InvitationForm from './InvitationForm';
import InvitationPreview from './InvitationPreview';
import BackgroundSelector from './BackgroundSelector';
import FontSelector from './FontSelector';
import TextPositionSelector from './TextPositionSelector';
import { SimpleInvitation, BackgroundType, TextPosition } from '@/types/invitation.types';
import { format } from 'date-fns';
import { 
  createSimpleInvitation, 
  updateSimpleInvitation 
} from '@/services/invitation/simple-invitations';
import { useAuth } from '@/lib/auth'; // Updated import path
import { InvitationData } from '@/services/invitation/invitation-types';

interface SimpleInvitationCreatorProps {
  existingInvitation?: SimpleInvitation;
  isEvent?: boolean;
}

export default function SimpleInvitationCreator({ 
  existingInvitation, 
  isEvent = false 
}: SimpleInvitationCreatorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth?.() || { user: null }; // Optional chaining for backward compatibility
  const [activeTab, setActiveTab] = useState<'details' | 'customize' | 'preview'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    location: '',
    locationTitle: '',
    date: '',
    time: '',
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
      weight: 'normal',
      position: 'middle' as TextPosition,
    },
    textLayout: {
      contentPosition: 'middle' as TextPosition,
      spacing: 'normal' as 'compact' | 'normal' | 'spacious',
    }
  });
  
  // Only define one handleSubmit
  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      
      if (!user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create invitations",
          variant: "destructive",
        });
        return;
      }
      
      let datetime = '';
      if (formValues.date) {
        datetime = formValues.time 
          ? `${formValues.date}T${formValues.time}:00` 
          : `${formValues.date}T00:00:00`;
      }
      
      const invitationData: InvitationData = {
        title: formValues.title,
        description: formValues.description,
        location: formValues.location,
        location_title: formValues.locationTitle,
        datetime,
        background_type: customization.background.type,
        background_value: customization.background.value,
        font_family: customization.font.family,
        font_size: customization.font.size,
        text_color: customization.font.color,
        text_align: customization.font.alignment || 'left',
        is_event: isEvent,
        user_id: user.id,
      };
      
      let result;
      
      if (existingInvitation) {
        result = await updateSimpleInvitation(existingInvitation.id, invitationData);
      } else {
        result = await createSimpleInvitation(invitationData);
      }
      
      if (result) {
        toast({
          title: existingInvitation ? "Invitation updated" : "Invitation created",
          description: existingInvitation
            ? "Your invitation has been updated successfully."
            : "Your invitation has been created successfully.",
        });
        
        navigate(isEvent ? '/dashboard/events' : '/dashboard/invitations');
      } else {
        throw new Error("Failed to save invitation");
      }
    } catch (error) {
      console.error("Error saving invitation:", error);
      toast({
        title: "Error",
        description: "Failed to save invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleBackgroundChange = (type: BackgroundType, value: string) => {
    setCustomization(prev => ({
      ...prev,
      background: { type, value },
    }));
  };
  
  const handleFontChange = (property: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        [property]: value,
      },
    }));
  };

  const handleTextLayoutChange = (property: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      textLayout: {
        ...prev.textLayout,
        [property]: value,
      },
    }));
  };
  
  // Load existing invitation data if editing
  useEffect(() => {
    if (existingInvitation) {
      setFormValues({
        title: existingInvitation.title || '',
        description: existingInvitation.description || '',
        location: existingInvitation.location || '',
        locationTitle: existingInvitation.locationTitle || '',
        date: existingInvitation.date || '',
        time: existingInvitation.time || '',
      });
      
      setCustomization({
        background: {
          type: existingInvitation.customization.background.type,
          value: existingInvitation.customization.background.value,
        },
        font: {
          family: existingInvitation.customization.font.family || 'system-ui, sans-serif',
          size: existingInvitation.customization.font.size || 'medium',
          color: existingInvitation.customization.font.color || '#000000',
          alignment: existingInvitation.customization.font.alignment || 'left',
          weight: existingInvitation.customization.font.weight || 'normal',
          position: existingInvitation.customization.font.position || 'middle',
        },
        textLayout: {
          contentPosition: existingInvitation.customization.textLayout?.contentPosition || 'middle',
          spacing: existingInvitation.customization.textLayout?.spacing || 'normal',
        }
      });
    }
  }, [existingInvitation]);

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {existingInvitation ? `Edit ${isEvent ? 'Event' : 'Invitation'}` : `Create ${isEvent ? 'Event' : 'Invitation'}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <InvitationForm 
                formData={formValues}
                onChange={handleFormChange} 
                isEvent={isEvent}
              />
            </TabsContent>
            
            <TabsContent value="customize">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <BackgroundSelector 
                    backgroundType={customization.background.type}
                    backgroundValue={customization.background.value}
                    onBackgroundChange={handleBackgroundChange}
                  />
                  
                  <FontSelector
                    font={customization.font}
                    onFontChange={handleFontChange}
                  />
                  
                  <TextPositionSelector
                    contentPosition={customization.textLayout.contentPosition}
                    spacing={customization.textLayout.spacing}
                    onPositionChange={(value) => handleTextLayoutChange('contentPosition', value)}
                    onSpacingChange={(value) => handleTextLayoutChange('spacing', value)}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  <InvitationPreview
                    title={formValues.title}
                    description={formValues.description}
                    location={formValues.location}
                    locationTitle={formValues.locationTitle}
                    date={formValues.date}
                    time={formValues.time}
                    customization={customization}
                    isEvent={isEvent}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="max-w-md mx-auto">
                <InvitationPreview
                  title={formValues.title}
                  description={formValues.description}
                  location={formValues.location}
                  locationTitle={formValues.locationTitle}
                  date={formValues.date}
                  time={formValues.time}
                  customization={customization}
                  isEvent={isEvent}
                  showActions={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(isEvent ? '/dashboard/events' : '/dashboard/invitations')}>
            Cancel
          </Button>
          <Button onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : existingInvitation ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
