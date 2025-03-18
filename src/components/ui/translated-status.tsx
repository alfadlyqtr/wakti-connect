
import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, AlertCircle, Info, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "error" | "info" | "warning" | "loading";

interface TranslatedStatusProps {
  type: StatusType;
  translationKey: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function TranslatedStatus({
  type,
  translationKey,
  className,
  iconClassName,
  textClassName
}: TranslatedStatusProps) {
  const { t } = useTranslation();
  
  const icons = {
    success: <CheckCircle className={cn("h-5 w-5 text-green-500", iconClassName)} />,
    error: <XCircle className={cn("h-5 w-5 text-red-500", iconClassName)} />,
    info: <Info className={cn("h-5 w-5 text-blue-500", iconClassName)} />,
    warning: <AlertCircle className={cn("h-5 w-5 text-amber-500", iconClassName)} />,
    loading: <Loader2 className={cn("h-5 w-5 text-muted-foreground animate-spin", iconClassName)} />
  };
  
  const bgColors = {
    success: "bg-green-50 dark:bg-green-950/30",
    error: "bg-red-50 dark:bg-red-950/30",
    info: "bg-blue-50 dark:bg-blue-950/30",
    warning: "bg-amber-50 dark:bg-amber-950/30",
    loading: "bg-muted/50"
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2 p-3 rounded-md", 
      bgColors[type],
      className
    )}>
      {icons[type]}
      <span className={cn("text-sm", textClassName)}>
        {t(translationKey)}
      </span>
    </div>
  );
}

export default TranslatedStatus;
