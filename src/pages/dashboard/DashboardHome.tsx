
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TasksOverview from "@/components/dashboard/home/TasksOverview";
import { useTaskContext } from "@/contexts/TaskContext";
import { getUpcomingTasks } from "@/services/taskService";
import WelcomeMessage from "@/components/dashboard/home/WelcomeMessage";
import { useAuth } from "@/hooks/useAuth";
import { NoTasks } from "@/components/dashboard/home/NoTasks";
import { DashboardCalendar } from "@/components/dashboard/home/DashboardCalendar";
import { CalendarEvent } from "@/types/calendar.types";
import { Task } from "@/types/task.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const { tasks, isLoading } = useTaskContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      try {
        const tasks = await getUpcomingTasks();
        setUpcomingTasks(tasks);
      } catch (error) {
        console.error("Error fetching upcoming tasks:", error);
      }
    };

    fetchUpcomingTasks();
  }, []);

  // Transform tasks into calendar events
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const taskEvents = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        date: new Date(task.due_date),
        type: "task" as const,
        status: task.status,
        isCompleted: task.status === "completed",
        priority: task.priority
      }));

      setCalendarEvents(taskEvents);
    } else {
      setCalendarEvents([]);
    }
  }, [tasks]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <WelcomeMessage user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <TasksOverview tasks={tasks} />
            ) : (
              <NoTasks 
                message="You don't have any tasks yet" 
                onCreateTask={() => navigate('/dashboard/tasks')}
              />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardCalendar 
              events={calendarEvents}
              isCompact={isMobile}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
