
import React, { useState, useEffect } from "react";
import { Reminder } from "@/types/reminder.types";
import { fetchReminders } from "@/services/reminder/reminderService";
import RemindersList from "./RemindersList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateReminderDialog } from "./CreateReminderDialog";
import { toast } from "@/components/ui/use-toast";

interface RemindersContainerProps {
  userRole: "free" | "individual" | "business" | "staff" | null;
  isPaidAccount: boolean;
}

const RemindersContainer: React.FC<RemindersContainerProps> = ({
  userRole,
  isPaidAccount
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  useEffect(() => {
    loadReminders();
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
    // Check if free user has reached limit
    if (!isPaidAccount && reminders.length >= 3) {
      toast({
        title: "Reminder limit reached",
        description: "Free accounts are limited to 3 active reminders. Please upgrade to create more.",
        variant: "destructive"
      });
      return;
    }
    
    setCreateDialogOpen(true);
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
        <Button 
          onClick={handleCreateReminder}
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>
      
      <RemindersList 
        reminders={reminders} 
        onReminderUpdate={loadReminders}
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
