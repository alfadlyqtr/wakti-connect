
import React, { useState, useEffect } from "react";
import { Reminder } from "@/types/reminder.types";
import { fetchReminders } from "@/services/reminder/reminderService";
import RemindersList from "./RemindersList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bell, ClipboardCheck, RefreshCw } from "lucide-react";
import { CreateReminderDialog } from "./CreateReminderDialog";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/user";
import { useReminders } from "@/hooks/useReminders";

interface RemindersContainerProps {
  userRole: UserRole;
  isPaidAccount: boolean;
}

const RemindersContainer: React.FC<RemindersContainerProps> = ({
  userRole,
  isPaidAccount
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  
  // Use our enhanced hook
  const { lastCheckTime, requestNotificationPermission } = useReminders();
  
  useEffect(() => {
    loadReminders();
    checkNotificationStatus();
  }, []);
  
  const loadReminders = async () => {
    try {
      setIsLoading(true);
      const reminderData = await fetchReminders();
      setReminders(reminderData);
    } catch (error) {
      console.error("Failed to load reminders:", error);
      toast({
        title: "Error loading reminders",
        description: "Failed to load your reminders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateReminder = () => {
    setCreateDialogOpen(true);
  };

  const checkNotificationStatus = () => {
    const hasPermission = Notification && Notification.permission === 'granted';
    setNotificationEnabled(hasPermission);
  };
  
  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    
    if (granted) {
      toast({
        title: "Browser notifications enabled",
        description: "You'll now receive browser notifications for reminders.",
        duration: 3000
      });
    } else {
      toast({
        title: "Browser notifications denied",
        description: "Please enable notifications in your browser settings to receive reminder alerts.",
        variant: "destructive",
        duration: 5000
      });
    }
  };
  
  const formatLastCheckTime = (time: Date) => {
    return time.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (reminders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No Reminders</h3>
        <p className="text-muted-foreground mb-6">
          You don't have any active reminders. Create one to get started.
        </p>
        
        <Button 
          onClick={handleCreateReminder}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Reminder
        </Button>
        
        <CreateReminderDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onReminderCreated={loadReminders}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Reminders</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handleRequestNotifications} 
            size="sm"
            variant={notificationEnabled ? "default" : "outline"}
            title={notificationEnabled ? "Browser notifications enabled" : "Enable browser notifications"}
            className={notificationEnabled ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Bell className="h-4 w-4 mr-2" />
            {notificationEnabled ? "Notifications On" : "Enable Notifications"}
          </Button>
          
          <Button 
            onClick={handleCreateReminder}
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </div>
      </div>
      
      <RemindersList 
        reminders={reminders} 
        onReminderUpdate={loadReminders}
        getRelativeTime={(time: string) => {
          const date = new Date(time);
          const now = new Date();
          const diff = date.getTime() - now.getTime();
          
          if (diff <= 0) return "Past due";
          
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          if (hours > 0) return `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
          return `Due in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }}
      />
      
      <CreateReminderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onReminderCreated={loadReminders}
      />
    </div>
  );
};

export default RemindersContainer;
