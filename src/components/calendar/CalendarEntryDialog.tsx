
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/use-theme';

interface CalendarEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (entry: any) => void;
  selectedDate: Date;
  userId: string;
}

const CalendarEntryDialog: React.FC<CalendarEntryDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  selectedDate,
  userId
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(selectedDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your entry",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a new entry in the database - fixed table name to match the schema
      const { data, error } = await supabase
        .from('calendar_manual_entries')
        .insert({
          user_id: userId,
          title,
          description,
          date: format(date, 'yyyy-MM-dd'),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Calendar entry created successfully"
      });
      
      // Call the success callback with the new entry
      onSuccess(data);
      
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating calendar entry:', error);
      toast({
        title: "Error",
        description: "Failed to create calendar entry",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : ""}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-gray-100" : ""}>Add Calendar Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className={isDarkMode ? "text-gray-200" : ""}>Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className={isDarkMode ? "text-gray-200" : ""}>Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-gray-200" : ""}>Date</Label>
            <div className="border rounded-md p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                disabled={(date) => date < new Date('1900-01-01')}
                initialFocus
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className={isDarkMode ? "border-gray-600 hover:bg-gray-700 text-gray-200" : ""}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={isDarkMode ? "bg-blue-700 hover:bg-blue-800" : ""}
            >
              {isSubmitting ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEntryDialog;
