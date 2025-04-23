import React, { useState, useEffect } from "react";
import { Reminder } from "@/types/reminder.types";
import { fetchReminders } from "@/services/reminder/reminderService";
import RemindersList from "./RemindersList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Volume2, VolumeX } from "lucide-react";
import { CreateReminderDialog } from "./CreateReminderDialog";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/user";
import { requestAudioPermission } from "@/utils/audioUtils";

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
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  useEffect(() => {
    loadReminders();
    checkAudioStatus();
  }, []);
  
  const checkAudioStatus = async () => {
    const audioStatus = localStorage.getItem('reminderAudioEnabled');
    setAudioEnabled(audioStatus === 'true');
  };
  
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

  const toggleAudio = async () => {
    if (!audioEnabled) {
      const granted = await requestAudioPermission();
      if (granted) {
        setAudioEnabled(true);
        localStorage.setItem('reminderAudioEnabled', 'true');
        toast({
          title: "Audio notifications enabled",
          description: "You'll now hear sounds when reminders are triggered.",
          duration: 3000
        });
      } else {
        toast({
          title: "Could not enable audio",
          description: "Your browser may not support audio notifications.",
          variant: "destructive",
          duration: 3000
        });
      }
    } else {
      setAudioEnabled(false);
      localStorage.setItem('reminderAudioEnabled', 'false');
      toast({
        title: "Audio notifications disabled",
        description: "You won't hear sounds when reminders are triggered.",
        duration: 3000
      });
    }
  };
  
  const getRelativeTime = (reminderTime: string) => {
    const now = new Date();
    const reminder = new Date(reminderTime);
    const diffInSeconds = Math.floor((reminder.getTime() - now.getTime()) / 1000);
    
    if (diffInSeconds < 0) return "Due now";
    if (diffInSeconds < 60) return `Due in ${diffInSeconds} seconds`;
    if (diffInSeconds < 3600) return `Due in ${Math.floor(diffInSeconds / 60)} minutes`;
    return `Due in ${Math.floor(diffInSeconds / 3600)} hours`;
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
            onClick={toggleAudio} 
            size="sm"
            variant="outline"
            title={audioEnabled ? "Disable sound alerts" : "Enable sound alerts"}
          >
            {audioEnabled ? (
              <><Volume2 className="h-4 w-4 mr-2" /> Sound On</>
            ) : (
              <><VolumeX className="h-4 w-4 mr-2" /> Sound Off</>
            )}
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
        getRelativeTime={getRelativeTime}
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
