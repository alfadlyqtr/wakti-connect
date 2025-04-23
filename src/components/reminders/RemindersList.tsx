
import React, { useState, useEffect } from "react";
import { Reminder } from "@/types/reminder.types";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Repeat, Trash2, Bell, AlertTriangle } from "lucide-react";
import { deleteReminder } from "@/services/reminder/reminderService";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface RemindersListProps {
  reminders: Reminder[];
  onReminderUpdate: () => void;
  getRelativeTime: (reminderTime: string) => string;
}

const RemindersList: React.FC<RemindersListProps> = ({ 
  reminders,
  onReminderUpdate,
  getRelativeTime
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
  
  const getCountdown = (reminderTime: string) => {
    const reminderDate = new Date(reminderTime);
    const diff = reminderDate.getTime() - currentTime.getTime();
    
    if (diff <= 0) return "Due now";
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Format the countdown
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  const isImminent = (reminderTime: string) => {
    const reminderDate = new Date(reminderTime);
    const diff = reminderDate.getTime() - currentTime.getTime();
    const seconds = Math.floor(diff / 1000);
    return seconds >= 0 && seconds < 60; // Less than 1 minute
  };
  
  const isPastDue = (reminderTime: string) => {
    const reminderDate = new Date(reminderTime);
    return reminderDate < currentTime;
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reminders.map((reminder) => {
        const pastDue = isPastDue(reminder.reminder_time);
        const imminent = isImminent(reminder.reminder_time);
        
        return (
          <Card 
            key={reminder.id} 
            className={`overflow-hidden transition-all duration-300 ${
              pastDue 
                ? 'border-red-400 shadow-red-200 shadow-md' 
                : imminent 
                  ? 'border-amber-400 shadow-amber-200 shadow-md animate-pulse' 
                  : ''
            }`}
          >
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">{reminder.message}</h3>
              
              <div className="flex items-center text-muted-foreground mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span>{format(new Date(reminder.reminder_time), 'MMM d, yyyy h:mm a')}</span>
              </div>
              
              <div className={`text-sm font-medium ${
                pastDue ? 'text-red-500' : 'text-primary'
              }`}>
                {getRelativeTime(reminder.reminder_time)}
              </div>
              
              {pastDue && (
                <div className="flex items-center text-red-600 mt-2 font-medium">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Past due</span>
                </div>
              )}
              
              {imminent && !pastDue && (
                <div className="flex items-center text-amber-600 mt-2 font-medium">
                  <Bell className="h-4 w-4 mr-2 animate-pulse" />
                  <span className="animate-pulse">Countdown: {getCountdown(reminder.reminder_time)}</span>
                </div>
              )}
              
              {reminder.repeat_type !== 'none' && (
                <div className="flex items-center text-muted-foreground mt-2">
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
        );
      })}
      
      {reminders.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No reminders found. Create one to get started.</p>
        </div>
      )}
    </div>
  );
};

export default RemindersList;
