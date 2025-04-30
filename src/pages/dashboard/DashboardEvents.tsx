
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Grid, List, PlusCircle } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventTab } from "@/types/event.types";
import { EventList } from "@/components/events/EventList";
import { EventGrid } from "@/components/events/EventGrid";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { Skeleton } from "@/components/ui/skeleton";
import SectionContainer from "@/components/ui/section-container";

const DashboardEvents = () => {
  const { events, isLoading, error } = useEvents();
  const [activeTab, setActiveTab] = useState<EventTab>("my-events");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <SectionContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Events</h1>
          <p className="text-muted-foreground">Create and manage your events</p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="my-events" value={activeTab} onValueChange={(value) => setActiveTab(value as EventTab)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
              <TabsTrigger value="invited-events">Invitations</TabsTrigger>
              <TabsTrigger value="draft-events">Drafts</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2 items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? "bg-primary/10" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "bg-primary/10" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="my-events" className="mt-0">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-40 bg-muted" />
                      <div className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length > 0 ? (
              viewMode === 'grid' ? <EventGrid events={events} /> : <EventList events={events} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-lg border border-dashed">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No events found</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  You haven't created any events yet. Get started by creating your first event.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invited-events" className="mt-0">
            {/* Similar content for invited events */}
            <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-lg border border-dashed">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No invitations</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                You don't have any event invitations right now.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="draft-events" className="mt-0">
            {/* Similar content for draft events */}
            <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-lg border border-dashed">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No draft events</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                You don't have any draft events. Start creating an event to save it as a draft.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <CreateEventDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </SectionContainer>
  );
};

export default DashboardEvents;
