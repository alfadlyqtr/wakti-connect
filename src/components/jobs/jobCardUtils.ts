
import { JobCard } from "@/types/jobs.types";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

export type FilterPeriod = "all" | "today" | "thisWeek" | "thisMonth";

/**
 * Filter job cards based on selected period
 */
export const filterJobCards = (cards: JobCard[] = [], period: FilterPeriod) => {
  if (period === "all") return cards;
  
  return cards.filter(card => {
    const date = parseISO(card.start_time);
    switch (period) {
      case "today": return isToday(date);
      case "thisWeek": return isThisWeek(date);
      case "thisMonth": return isThisMonth(date);
      default: return true;
    }
  });
};

/**
 * Count jobs by date
 */
export const getJobCountByDate = (cards: JobCard[]) => {
  const counts: Record<string, number> = {};
  
  cards.forEach(card => {
    const dateStr = format(new Date(card.start_time), "yyyy-MM-dd");
    counts[dateStr] = (counts[dateStr] || 0) + 1;
  });
  
  return counts;
};

/**
 * Calculate total duration for filtered completed jobs
 */
export const getTotalDuration = (cards: JobCard[]) => {
  let totalMinutes = 0;
  
  cards.forEach(card => {
    if (card.end_time) {
      const start = new Date(card.start_time);
      const end = new Date(card.end_time);
      const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
      totalMinutes += diffMinutes;
    }
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
