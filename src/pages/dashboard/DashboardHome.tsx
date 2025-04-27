
import React, { useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardSummaryCards } from "@/components/dashboard/home/DashboardSummaryCards";
import DashboardTasks from "@/components/dashboard/home/DashboardTasks";
import DashboardProfile from "@/components/dashboard/home/DashboardProfile";
import DashboardReminders from "@/components/dashboard/home/DashboardReminders";
import DashboardBookings from "@/components/dashboard/home/DashboardBookings";
import DashboardAnalytics from "@/components/dashboard/home/DashboardAnalytics";
import DashboardEvents from "@/components/dashboard/home/DashboardEvents";
import { DashboardWidgetLayout, WidgetType } from "@/types/dashboard";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { Loader2 } from "lucide-react";
import { DashboardCalendar } from "@/components/dashboard/home/DashboardCalendar";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const DashboardHome = () => {
  const {
    profileData,
    todayTasks,
    unreadNotifications,
    isLoading,
  } = useDashboardData();

  const { layout, setLayout } = useDashboardLayout();

  // Default widget configuration
  const defaultWidgets: { id: WidgetType; span: string }[] = [
    { id: "tasks", span: "col-span-1" },
    { id: "calendar", span: "col-span-1" },
    { id: "reminders", span: "col-span-1" },
    { id: "bookings", span: "col-span-1 md:col-span-1" },
    { id: "analytics", span: "col-span-1 md:col-span-2" },
    { id: "events", span: "col-span-1" },
    { id: "profile", span: "col-span-1" }
  ];

  // Initialize layout on first load
  useEffect(() => {
    if (layout.length === 0) {
      setLayout(defaultWidgets.map((widget, idx) => ({
        id: widget.id,
        order: idx
      })));
    }
  }, [layout, setLayout]);

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(layout);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update orders
    const newLayout = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setLayout(newLayout);
  };

  // Render widget based on ID
  const renderWidget = (widgetId: WidgetType) => {
    switch (widgetId) {
      case "tasks":
        return <DashboardTasks tasks={todayTasks} />;
      case "calendar":
        return <DashboardCalendar isCompact={true} />;
      case "reminders":
        return <DashboardReminders />;
      case "bookings":
        return <DashboardBookings />;
      case "analytics":
        return <DashboardAnalytics />;
      case "events":
        return <DashboardEvents />;
      case "profile":
        return <DashboardProfile profileData={profileData} />;
      default:
        return null;
    }
  };

  // Get widget span class
  const getWidgetSpan = (widgetId: WidgetType) => {
    const widget = defaultWidgets.find(w => w.id === widgetId);
    return widget ? widget.span : "col-span-1";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sort widgets by order
  const sortedWidgets = [...layout].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <DashboardSummaryCards
        todayTasks={todayTasks}
        isLoading={isLoading}
      />

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium">Dashboard Widgets</h2>
        <div className="text-xs text-muted-foreground italic">
          Drag and drop widgets to reorder
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets" direction="horizontal">
          {(provided) => (
            <div 
              className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedWidgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${getWidgetSpan(widget.id as WidgetType)} transition-all ${
                        snapshot.isDragging ? "z-50 shadow-lg" : ""
                      }`}
                    >
                      <div 
                        className="h-full rounded-lg border bg-card relative group"
                        {...provided.dragHandleProps}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-lg flex items-center justify-center">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-medium">Drag to reorder</span>
                          </div>
                        </div>
                        {renderWidget(widget.id as WidgetType)}
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
