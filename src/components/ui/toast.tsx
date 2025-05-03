
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dismiss, Toast as ToastType, ReminderToastData } from "@/hooks/use-toast";
import ReminderToast from "@/components/reminders/ReminderToast";

interface ToastProps {
  toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
  const { id, title, description, action, variant = "default" } = toast;

  // Check if this is a reminder toast
  const isReminderToast = description && 
    typeof description === 'object' && 
    'type' in description && 
    description.type === 'reminder-toast';

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variant === "default" && "bg-background",
        variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
        variant === "success" && "border-green-500 bg-green-500 text-white",
        variant === "warning" && "border-yellow-500 bg-yellow-500 text-white"
      )}
    >
      <div className="grid gap-1 w-full">
        {title && <h3 className="font-medium">{title}</h3>}
        
        {isReminderToast ? (
          // Render ReminderToast component when description is a reminder toast data
          <ReminderToast
            reminder={(description as ReminderToastData).reminder}
            notification={(description as ReminderToastData).notification}
            onClose={() => {
              dismiss(id);
              if ((description as ReminderToastData).onClose) {
                (description as ReminderToastData).onClose();
              }
            }}
          />
        ) : (
          // Render regular description
          description && typeof description === 'string' && (
            <p className="text-sm opacity-90">{description}</p>
          )
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {action}
        <button
          type="button"
          onClick={() => dismiss(id)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium",
            variant === "default" && "border-muted-foreground/50 hover:bg-secondary text-foreground",
            variant === "destructive" && "border-muted hover:bg-destructive/90 text-destructive-foreground",
            variant === "success" && "border-muted hover:bg-green-600 text-white",
            variant === "warning" && "border-muted hover:bg-yellow-600 text-white"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Re-export from hooks/use-toast
export { useToast, toast } from "@/hooks/use-toast";
export type { Toast as ToastProps } from "@/hooks/use-toast";
