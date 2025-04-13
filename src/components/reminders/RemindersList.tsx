
import React from "react";
import { Reminder } from "@/types/reminder.types";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Repeat, Trash2 } from "lucide-react";
import { deleteReminder } from "@/services/reminder/reminderService";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface RemindersListProps {
  reminders: Reminder[];
  onReminderUpdate: () => void;
}

const RemindersList: React.FC<RemindersListProps> = ({ 
  reminders,
  onReminderUpdate
}) => {
  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id);
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been deleted successfully.",
        variant: "success"
      });
      onReminderUpdate();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({
        title: "Error deleting reminder",
        description: "Failed to delete reminder. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatReminderTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };
  
  const getRepeatLabel = (repeatType: string) => {
    switch (repeatType) {
      case 'daily':
        return 'Repeats daily';
      case 'weekly':
        return 'Repeats weekly';
      default:
        return 'Does not repeat';
    }
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className="overflow-hidden">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">{reminder.message}</h3>
            
            <div className="flex items-center text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatReminderTime(reminder.reminder_time)}</span>
            </div>
            
            {reminder.repeat_type !== 'none' && (
              <div className="flex items-center text-muted-foreground">
                <Repeat className="h-4 w-4 mr-2" />
                <span>{getRepeatLabel(reminder.repeat_type)}</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="bg-muted/50 pt-2">
            <Button 
              variant="destructive" 
              size="sm" 
              className="ml-auto"
              onClick={() => handleDelete(reminder.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RemindersList;
