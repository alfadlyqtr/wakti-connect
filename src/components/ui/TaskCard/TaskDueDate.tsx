
import React from "react";
import { formatDistanceToNow, isPast, isToday, format } from "date-fns";
import { CalendarIcon, BellOff } from "lucide-react";
import { formatTimeString } from "@/utils/dateTimeFormatter";
import { useTranslation } from "react-i18next";
import { ar } from "date-fns/locale";

interface TaskDueDateProps {
  dueDate: Date | string;
  dueTime: string | null | undefined;
  status: string;
  snoozedUntil?: Date | string | null;
  snoozeCount?: number;
}

export const TaskDueDate: React.FC<TaskDueDateProps> = ({
  dueDate,
  dueTime,
  status,
  snoozedUntil,
  snoozeCount
}) => {
  const { t, i18n } = useTranslation();
  
  const formatDueDate = () => {
    if (!dueDate || (typeof dueDate === 'string' && !dueDate.trim())) {
      return t("common.noDate");
    }
    
    const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    if (isNaN(dateObj.getTime())) return t("common.invalidDate");
    
    // Use proper locale for date formatting
    const locale = i18n.language === 'ar' ? ar : undefined;
    
    if (isToday(dateObj)) {
      return t("time.today");
    }
    
    if (isPast(dateObj) && status !== 'completed') {
      return `${t("task.overdue")}: ${formatDistanceToNow(dateObj, { addSuffix: true, locale })}`;
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true, locale });
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>
          {formatDueDate()}
          {dueTime && (
            <span className="font-medium ml-1">{t("time.at")} {formatTimeString(dueTime)}</span>
          )}
        </span>
      </div>
      
      {status === 'snoozed' && snoozedUntil && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <BellOff className="h-4 w-4" />
          <span>
            {t("task.snoozedUntil")} {format(new Date(snoozedUntil), 'MMM d')}
            {snoozeCount && snoozeCount > 1 ? ` (${snoozeCount} ${t("time.times")})` : ''}
          </span>
        </div>
      )}
    </div>
  );
};
