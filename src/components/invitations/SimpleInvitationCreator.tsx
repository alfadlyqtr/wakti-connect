import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import BackgroundSelector from './BackgroundSelector';
import FontSelector from './FontSelector';
import TextPositionSelector from './TextPositionSelector';
import ButtonPositionSelector from './ButtonPositionSelector';
import InvitationPreview from './InvitationPreview';
import { createSimpleInvitation, updateSimpleInvitation } from '@/services/invitation/simple-invitations';
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';

interface SimpleInvitationCreatorProps {
  isEvent?: boolean;
  existingInvitation?: SimpleInvitation;
}

export default function SimpleInvitationCreator({
  isEvent = false,
  existingInvitation
}: SimpleInvitationCreatorProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customization, setCustomization] = useState<SimpleInvitationCustomization>({
    background: {
      type: existingInvitation?.customization?.background?.type || 'solid',
      value: existingInvitation?.customization?.background?.value || '#ffffff'
    },
    font: {
      family: existingInvitation?.customization?.font?.family || 'system-ui, sans-serif',
      size: existingInvitation?.customization?.font?.size || 'medium',
      color: existingInvitation?.customization?.font?.color || '#000000',
      alignment: existingInvitation?.customization?.font?.alignment || 'center'
    },
    buttons: {
      accept: {
        background: existingInvitation?.customization?.buttons?.accept?.background || '#3B82F6',
        color: existingInvitation?.customization?.buttons?.accept?.color || '#ffffff',
        shape: existingInvitation?.customization?.buttons?.accept?.shape || 'rounded'
      },
      decline: {
        background: existingInvitation?.customization?.buttons?.decline?.background || '#EF4444',
        color: existingInvitation?.customization?.buttons?.decline?.color || '#ffffff',
        shape: existingInvitation?.customization?.buttons?.decline?.shape || 'rounded'
      },
      directions: {
        show: existingInvitation?.customization?.buttons?.directions?.show ?? true,
        background: existingInvitation?.customization?.buttons?.directions?.background || '#3B82F6',
        color: existingInvitation?.customization?.buttons?.directions?.color || '#ffffff',
        shape: existingInvitation?.customization?.buttons?.directions?.shape || 'rounded',
        position: existingInvitation?.customization?.buttons?.directions?.position || 'bottom-right'
      },
      calendar: {
        show: existingInvitation?.customization?.buttons?.calendar?.show ?? true,
        background: existingInvitation?.customization?.buttons?.calendar?.background || '#3B82F6',
        color: existingInvitation?.customization?.buttons?.calendar?.color || '#ffffff',
        shape: existingInvitation?.customization?.buttons?.calendar?.shape || 'rounded',
        position: existingInvitation?.customization?.buttons?.calendar?.position || 'bottom-left'
      }
    },
    textLayout: {
      contentPosition: existingInvitation?.customization?.textLayout?.contentPosition || 'middle',
      spacing: existingInvitation?.customization?.textLayout?.spacing || 'normal'
    }
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      title: existingInvitation?.title || '',
      description: existingInvitation?.description || '',
      location: existingInvitation?.location || '',
      locationTitle: existingInvitation?.locationTitle || '',
      date: existingInvitation?.date || '',
      time: existingInvitation?.time || '',
    }
  });

  const handleBackgroundChange = (type: BackgroundType, value: string) => {
    setCustomization(prevState => ({
      ...prevState,
      background: { type, value }
    }));
  };

  const handleFontChange = (property: string, value: string) => {
    setCustomization(prevState => ({
      ...prevState,
      font: { ...prevState.font, [property]: value }
    }));
  };

  const handleTextLayoutChange = (property: string, value: string) => {
    setCustomization(prevState => ({
      ...prevState,
      textLayout: { ...prevState.textLayout, [property]: value }
    }));
  };

  const handleButtonChange = (buttonType: string, property: string, value: string | boolean) => {
    setCustomization(prevState => ({
      ...prevState,
      buttons: {
        ...prevState.buttons,
        [buttonType]: {
          ...prevState.buttons[buttonType],
          [property]: value
        }
      }
    }));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedDateTime = data.date && data.time ? `${data.date}T${data.time}` : data.date ? `${data.date}T00:00:00` : undefined;
      const invitationData: InvitationData = {
        title: data.title,
        description: data.description,
        location: data.location,
        location_title: data.locationTitle,
        datetime: formattedDateTime,
        background_type: customization.background.type,
        background_value: customization.background.value,
        font_family: customization.font.family,
        font_size: customization.font.size,
        text_color: customization.font.color,
        text_align: customization.font.alignment || 'center',
        is_event: isEvent,
        user_id: '', // This will be filled in by the API if not provided
      };

      let result;
      if (existingInvitation) {
        result = await updateSimpleInvitation(existingInvitation.id, invitationData);
        if (result) {
          toast({
            title: "Success",
            description: isEvent ? "Event updated successfully" : "Invitation updated successfully",
          });
        }
      } else {
        result = await createSimpleInvitation(invitationData);
        if (result) {
          toast({
            title: "Success",
            description: isEvent ? "Event created successfully" : "Invitation created successfully",
          });
        }
      }

      // Navigate back to the list view
      navigate(isEvent ? '/dashboard/events' : '/dashboard/invitations');
    } catch (error) {
      console.error('Error saving invitation:', error);
      toast({
        title: "Error",
        description: `Failed to ${existingInvitation ? 'update' : 'create'} ${isEvent ? 'event' : 'invitation'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedFields = watch();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {existingInvitation 
          ? (isEvent ? "Edit Event" : "Edit Invitation") 
          : (isEvent ? "Create New Event" : "Create New Invitation")}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Form */}
        <div>
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register('title', { required: "Title is required" })}
                    placeholder="Enter a title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter a description"
                    rows={4}
                  />
                </div>
                
                {isEvent && (
                  <>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register('date', { required: isEvent ? "Date is required for events" : false })}
                        className={errors.date ? "border-red-500" : ""}
                      />
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message as string}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        {...register('time')}
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Enter a location"
                  />
                </div>
                
                <div>
                  <Label htmlFor="locationTitle">Location Title (optional)</Label>
                  <Input
                    id="locationTitle"
                    {...register('locationTitle')}
                    placeholder="E.g. Office, Home, etc."
                  />
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Customize Style</h3>
                
                <div className="space-y-6">
                  <BackgroundSelector
                    backgroundType={customization.background.type}
                    backgroundValue={customization.background.value}
                    onBackgroundChange={(type, value) => handleBackgroundChange(type, value)}
                  />
                  
                  <FontSelector
                    font={customization.font}
                    onFontChange={handleFontChange}
                    showAlignment
                    showWeight
                  />
                  
                  <TextPositionSelector
                    contentPosition={customization.textLayout?.contentPosition || 'middle'}
                    spacing={customization.textLayout?.spacing || 'normal'}
                    onPositionChange={(position) => handleTextLayoutChange('contentPosition', position)}
                    onSpacingChange={(spacing) => handleTextLayoutChange('spacing', spacing)}
                    onChange={handleTextLayoutChange}
                  />
                  
                  {(isEvent || watchedFields.location) && (
                    <ButtonPositionSelector
                      directionsButton={customization.buttons?.directions}
                      calendarButton={customization.buttons?.calendar}
                      onChange={handleButtonChange}
                      showCalendar={isEvent}
                      showDirections={!!watchedFields.location}
                    />
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(isEvent ? '/dashboard/events' : '/dashboard/invitations')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (existingInvitation ? "Update" : "Create")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Right column - Preview */}
        <div className="lg:sticky lg:top-24 self-start">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <InvitationPreview
            title={watchedFields.title || (isEvent ? "Event Title" : "Invitation Title")}
            description={watchedFields.description || "Description will appear here"}
            location={watchedFields.location || undefined}
            locationTitle={watchedFields.locationTitle || undefined}
            date={watchedFields.date || undefined}
            time={watchedFields.time || undefined}
            customization={customization}
            isEvent={isEvent}
            showActions={true}
          />
        </div>
      </div>
    </div>
  );
}
