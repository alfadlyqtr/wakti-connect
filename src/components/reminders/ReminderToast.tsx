
import React from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Reminder, ReminderNotification } from "@/types/reminder.types";
import { Button } from "@/components/ui/button";
import { snoozeReminder, dismissReminderNotification } from "@/services/reminder/reminderService";
import { BellRing } from "lucide-react";

interface ReminderToastProps {
  reminder: Reminder;
  notification: ReminderNotification;
  onClose: () => void;
}

const ReminderToast: React.FC<ReminderToastProps> = ({
  reminder,
  notification,
  onClose
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  const handleSnooze = async (minutes: number) => {
    try {
      await snoozeReminder(notification.id, minutes);
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error("Error snoozing reminder:", error);
    }
  };
  
  const handleDismiss = async () => {
    try {
      await dismissReminderNotification(notification.id);
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error("Error dismissing reminder:", error);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-[350px]">
        <AlertDialogHeader className="flex items-center flex-col space-y-2">
          <BellRing className="h-8 w-8 text-primary animate-bounce" />
          <AlertDialogTitle>Reminder</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            {reminder.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleSnooze(5)}
            >
              Snooze 5m
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => handleSnooze(10)}
            >
              Snooze 10m
            </Button>
          </div>
          
          <AlertDialogAction 
            className="w-full sm:w-auto"
            onClick={handleDismiss}
          >
            Dismiss
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReminderToast;
