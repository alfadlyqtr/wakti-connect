import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardUserProfile } from "@/hooks/useDashboardUserProfile";
import { UserRole } from "@/types/user";
import { DashboardCalendar } from "@/components/dashboard/home/DashboardCalendar";
import { CalendarEvent } from "@/types/calendar.types";
import RemindersOverview from "@/components/dashboard/home/RemindersOverview";
import DashboardBookingsPreview from "@/components/dashboard/home/DashboardBookingsPreview";
import DashboardEventsPreview from "@/components/dashboard/home/DashboardEventsPreview";
import BusinessAnalyticsPreview from "@/components/dashboard/home/BusinessAnalyticsPreview";
import TasksOverview from "@/components/dashboard/home/TasksOverview";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import EventCountBadge from "@/components/dashboard/home/EventCountBadge";
import { DashboardWidgetLayout, WidgetType } from "@/types/dashboard";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(2025, 3, 23, 10, 0),
    type: "booking",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Client Call",
    date: new Date(2025, 3, 24, 15, 30),
    type: "booking",
    status: "confirmed",
  },
  {
    id: "3",
    title: "Project Deadline",
    date: new Date(2025, 3, 25, 17, 0),
    type: "task",
    status: "pending",
  },
  {
    id: "4",
    title: "Today's Task",
    date: new Date(),
    type: "task",
    status: "pending",
  },
];

const defaultLayout: DashboardWidgetLayout[] = [
  { id: "tasks", order: 0 },
  { id: "reminders", order: 1 },
  { id: "bookings", order: 2 },
  { id: "events", order: 3 },
  { id: "subscribers", order: 4 },
  { id: "calendar", order: 5 },
  { id: "analytics", order: 6 }
];

const DashboardHome: React.FC = () => {
  const { profileData, userRole, userId } = useDashboardUserProfile();
  const { toast } = useToast();
  const [layout, setLayout] = useState<DashboardWidgetLayout[]>(defaultLayout);
  const [isLoading, setIsLoading] = useState(true);
  
  const isBusinessOrAdmin = userRole === 'business' || userRole === 'super-admin';
  
  const { subscriberCount, isLoading: subscribersLoading } = useBusinessSubscribers(userId || '', {
    enabled: !!userId && isBusinessOrAdmin
  });
  
  const eventCounts = {
    total: sampleEvents.length,
    tasks: sampleEvents.filter(event => event.type === "task").length,
    bookings: sampleEvents.filter(event => event.type === "booking").length,
    today: sampleEvents.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate.getDate() === today.getDate() && 
             eventDate.getMonth() === today.getMonth() && 
             eventDate.getFullYear() === today.getFullYear();
    }).length
  };
  
  useEffect(() => {
    const loadUserLayout = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('dashboard_layout')
          .eq('user_id', userId)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            setIsLoading(false);
            return;
          }
          
          console.error('Error loading dashboard layout:', error);
          setIsLoading(false);
          return;
        }
        
        if (data?.dashboard_layout) {
          let layoutData;
          try {
            if (typeof data.dashboard_layout === 'string') {
              layoutData = JSON.parse(data.dashboard_layout);
            } else {
              layoutData = data.dashboard_layout;
            }
            
            if (!layoutData.some((item: DashboardWidgetLayout) => item.id === 'events')) {
              layoutData.push({ id: "events", order: layoutData.length });
            }
            
            setLayout(layoutData);
          } catch (parseError) {
            console.error('Failed to parse dashboard layout:', parseError);
            setLayout(defaultLayout);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to parse dashboard layout:', err);
        setIsLoading(false);
      }
    };
    
    loadUserLayout();
  }, [userId]);
  
  const saveLayout = async (newLayout: DashboardWidgetLayout[]) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dashboard_layout: JSON.stringify(newLayout),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) {
        console.error('Error saving dashboard layout:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to save layout',
          description: 'Your dashboard layout could not be saved.'
        });
      }
    } catch (err) {
      console.error('Failed to save dashboard layout:', err);
    }
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(layout);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedLayout = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setLayout(updatedLayout);
    saveLayout(updatedLayout);
  };

  if (!profileData || isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  const getOrderedWidgets = () => {
    const widgets = [
      {
        id: "tasks",
        content: <TasksOverview userRole={userRole} />,
        span: "col-span-1 md:col-span-1"
      },
      {
        id: "reminders",
        content: <RemindersOverview userRole={userRole} />,
        span: "col-span-1 md:col-span-1"
      },
      {
        id: "bookings",
        content: (
          <ErrorBoundary>
            <DashboardBookingsPreview userRole={userRole} />
          </ErrorBoundary>
        ),
        span: "col-span-1 md:col-span-1"
      },
      {
        id: "events",
        content: (
          <ErrorBoundary>
            <DashboardEventsPreview userRole={userRole} />
          </ErrorBoundary>
        ),
        span: "col-span-1 md:col-span-1"
      },
      {
        id: "calendar",
        content: (
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-lg font-semibold">Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <EventCountBadge 
                  count={eventCounts.today} 
                  label="today" 
                  className="text-xs" 
                />
                <EventCountBadge 
                  count={eventCounts.total} 
                  label="total"
                  className="text-xs" 
                />
              </div>
            </CardHeader>
            <CardContent>
              <DashboardCalendar events={sampleEvents} />
            </CardContent>
          </Card>
        ),
        span: "col-span-1 md:col-span-2 lg:col-span-2"
      }
    ];
    
    if (isBusinessOrAdmin) {
      widgets.push({
        id: "subscribers",
        content: (
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscribersLoading ? (
                <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl sm:text-3xl font-bold">{subscriberCount}</div>
                  <p className="text-sm text-muted-foreground">
                    Total subscribers to your business
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ),
        span: "col-span-1"
      });
      
      widgets.push({
        id: "analytics",
        content: (
          <BusinessAnalyticsPreview 
            profileData={{
              account_type: isBusinessOrAdmin ? 'business' : 'individual',
              business_name: typeof profileData === 'object' && 'business_name' in profileData
                ? profileData.business_name 
                : undefined
            }} 
          />
        ),
        span: "col-span-1 md:col-span-2 lg:col-span-1"
      });
    }
    
    return widgets.sort((a, b) => {
      const aIndex = layout.findIndex(item => item.id === a.id);
      const bIndex = layout.findIndex(item => item.id === b.id);
      return aIndex - bIndex;
    });
  };
  
  const orderedWidgets = getOrderedWidgets();
  
  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets" type="WIDGET" direction="horizontal">
          {(provided) => (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {orderedWidgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`${widget.span} ${snapshot.isDragging ? 'z-50' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className={`h-full ${snapshot.isDragging ? 'opacity-70 scale-105 shadow-xl' : ''} transition-all duration-200`}>
                        {widget.content}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DashboardHome;
