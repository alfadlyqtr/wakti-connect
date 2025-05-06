
import React from 'react';
import { CalendarEvent } from '@/types/calendar.types';
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: CalendarEvent[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case 'booking':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'event':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'manual':
        return <MapPin className="h-4 w-4 text-purple-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'task':
        return 'Task';
      case 'booking':
        return 'Booking';
      case 'event':
        return 'Event';
      case 'manual':
        return 'Manual Entry';
      case 'reminder':
        return 'Reminder';
      default:
        return 'Event';
    }
  };

  const getEventTypeBg = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-amber-50 border-amber-200';
      case 'booking':
        return 'bg-green-50 border-green-200';
      case 'event':
        return 'bg-blue-50 border-blue-200';
      case 'manual':
        return 'bg-purple-50 border-purple-200';
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className={`p-3 rounded-md border ${getEventTypeBg(task.type)}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-xs text-muted-foreground">
                {getEventTypeIcon(task.type)}
                <span>{getEventTypeLabel(task.type)}</span>
                {task.date && (
                  <span className="ml-auto text-xs text-gray-500">
                    {format(new Date(task.date), 'h:mm a')}
                  </span>
                )}
              </div>
              <div className="font-medium text-sm">{task.title}</div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              
              {task.location && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{task.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
