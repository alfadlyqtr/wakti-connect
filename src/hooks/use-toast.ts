
// Adapted from: https://ui.shadcn.com/docs/components/toast
import { useState, useEffect } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastActionElement = React.ReactElement;

export interface ToastProps extends Toast {
  id: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

// A simple toast store
let toasts: Toast[] = [];
let listeners: (() => void)[] = [];

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

export function toast(opts: ToastOptions) {
  const id = Math.random().toString(36).substring(2, 9);
  const toast: Toast = {
    id,
    title: opts.title,
    description: opts.description,
    action: opts.action,
    variant: opts.variant || "default",
  };
  
  toasts = [...toasts, toast];
  notify();

  // Auto-dismiss after duration
  setTimeout(() => {
    dismiss(id);
  }, opts.duration || 5000);

  return {
    id,
    dismiss: () => dismiss(id),
    update: (props: ToastOptions) => {
      toasts = toasts.map((t) => (t.id === id ? { ...t, ...props } : t));
      notify();
    },
  };
}

export function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [_toasts, setToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    const listener = () => {
      setToasts([...toasts]);
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toasts: _toasts,
    toast,
    dismiss,
  };
}
