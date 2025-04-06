
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import i18n from "@/i18n/i18n";

export function formatDate(date: Date | string): string {
  const formattedDate = format(
    typeof date === "string" ? new Date(date) : date,
    "MMMM d, yyyy",
    { locale: i18n.language === "ar" ? ar : undefined }
  );
  return formattedDate;
}

export function formatTime(date: Date | string): string {
  const formattedTime = format(
    typeof date === "string" ? new Date(date) : date,
    "h:mm a",
    { locale: i18n.language === "ar" ? ar : undefined }
  );
  return formattedTime;
}

export function getTimeBasedGreeting(name?: string): string {
  const currentHour = new Date().getHours();
  
  let greeting;
  
  if (currentHour >= 5 && currentHour < 12) {
    greeting = i18n.t("dateUtils.morning");
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = i18n.t("dateUtils.afternoon");
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = i18n.t("dateUtils.evening");
  } else {
    greeting = i18n.t("dateUtils.night");
  }
  
  return name ? `${greeting}, ${name}` : greeting;
}

export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays < 1) {
    return format(date, "h:mm a", { locale: i18n.language === "ar" ? ar : undefined });
  } else if (diffInDays === 1) {
    return i18n.t("ai.timeAgo.yesterday", { defaultValue: "Yesterday" });
  } else if (diffInDays < 7) {
    return i18n.t("ai.timeAgo.days", { count: diffInDays, defaultValue: "{{count}} days ago" });
  } else if (diffInDays < 14) {
    return i18n.t("ai.timeAgo.week", { defaultValue: "1 week ago" });
  } else if (diffInDays < 30) {
    return i18n.t("ai.timeAgo.weeks", { count: Math.floor(diffInDays / 7), defaultValue: "{{count}} weeks ago" });
  } else if (diffInDays < 60) {
    return i18n.t("ai.timeAgo.month", { defaultValue: "1 month ago" });
  } else {
    return i18n.t("ai.timeAgo.months", { count: Math.floor(diffInDays / 30), defaultValue: "{{count}} months ago" });
  }
}
