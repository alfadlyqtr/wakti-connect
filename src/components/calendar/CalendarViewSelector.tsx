
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarDays, CalendarRange, Calendar } from 'lucide-react';

interface CalendarViewSelectorProps {
  value: 'month' | 'week' | 'day';
  onValueChange: (value: 'month' | 'week' | 'day') => void;
}

export const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  value,
  onValueChange
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(val) => {
        if (val) onValueChange(val as 'month' | 'week' | 'day');
      }}
      className="border rounded-md bg-white dark:bg-gray-800"
    >
      <ToggleGroupItem value="month" aria-label="Month view">
        <CalendarDays className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Month</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem value="week" aria-label="Week view">
        <CalendarRange className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Week</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem value="day" aria-label="Day view">
        <Calendar className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Day</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
