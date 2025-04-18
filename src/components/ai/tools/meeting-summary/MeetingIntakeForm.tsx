
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IntakeFormData } from '@/hooks/ai/useMeetingSummaryV2';
import { Check, Building, Graduation, User } from 'lucide-react';

interface MeetingIntakeFormProps {
  onSubmit: (data: IntakeFormData) => void;
  onSkip: () => void;
}

export function MeetingIntakeForm({ onSubmit, onSkip }: MeetingIntakeFormProps) {
  const [formData, setFormData] = useState<IntakeFormData>({
    sessionType: 'auto',
    hostedBy: '',
    location: '',
    attendees: [],
    agenda: '',
  });
  
  const [attendeesInput, setAttendeesInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleSkip = () => {
    onSubmit({ sessionType: 'auto' });
    onSkip();
  };
  
  const handleAttendeeAdd = () => {
    if (!attendeesInput.trim()) return;
    
    // Split by commas or spaces
    const newAttendees = attendeesInput
      .split(/[,\s]+/)
      .filter(Boolean)
      .map(name => name.startsWith('@') ? name : `@${name}`);
    
    setFormData(prev => ({
      ...prev,
      attendees: [...(prev.attendees || []), ...newAttendees]
    }));
    
    setAttendeesInput('');
  };
  
  const removeAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees?.filter((_, i) => i !== index)
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Meeting Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Meeting Type</Label>
            <RadioGroup
              value={formData.sessionType}
              onValueChange={(value) => 
                setFormData(prev => ({ 
                  ...prev, 
                  sessionType: value as 'business' | 'class' | 'custom' | 'auto' 
                }))
              }
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business" className="flex items-center gap-1 cursor-pointer">
                  <Building className="h-4 w-4" />
                  Business
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class" className="flex items-center gap-1 cursor-pointer">
                  <Graduation className="h-4 w-4" />
                  Class
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center gap-1 cursor-pointer">
                  <User className="h-4 w-4" />
                  Custom
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto" className="flex items-center gap-1 cursor-pointer">
                  <Check className="h-4 w-4" />
                  Auto-detect
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.sessionType !== 'auto' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="hostedBy">Hosted By (Optional)</Label>
                <Input
                  id="hostedBy"
                  value={formData.hostedBy || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hostedBy: e.target.value }))}
                  placeholder="Enter host name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Meeting location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="attendees"
                    value={attendeesInput}
                    onChange={(e) => setAttendeesInput(e.target.value)}
                    placeholder="Add attendee names"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAttendeeAdd();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleAttendeeAdd}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.attendees && formData.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.attendees.map((attendee, index) => (
                      <div 
                        key={index} 
                        className="bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <span className="text-sm">{attendee}</span>
                        <button
                          type="button"
                          className="h-4 w-4 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center"
                          onClick={() => removeAttendee(index)}
                        >
                          <span className="text-xs">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda / Notes (Optional)</Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                  placeholder="Meeting agenda or additional notes"
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button type="submit">
            Start Recording
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
