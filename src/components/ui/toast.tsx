
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toast as ToastType, dismiss } from "./use-toast";

interface ToastProps {
  toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
  const { id, title, description, action, variant = "default" } = toast;

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variant === "default" && "bg-background",
        variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
        variant === "success" && "border-green-500 bg-green-500 text-white"
      )}
    >
      <div className="grid gap-1">
        {title && <h3 className="font-medium">{title}</h3>}
        {description && <p className="text-sm opacity-90">{description}</p>}
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
            variant === "success" && "border-muted hover:bg-green-600 text-white"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 p-4 max-w-md w-full right-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

// For importing in other files
import { useToast } from "./use-toast";
export { useToast };
