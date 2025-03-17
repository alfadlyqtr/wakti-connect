
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchEvents, 
  createEvent as createEventService,
  respondToInvitation as respondToInvitationService,
  Event,
  EventTab,
  EventFormData
} from "@/services/event";

export const useEvents = (tab: EventTab = "my-events") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [localUserRole, setLocalUserRole] = useState<"free" | "individual" | "business">("free");

  // Initialize user role from localStorage if available
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as "free" | "individual" | "business" | null;
    if (storedRole) {
      setLocalUserRole(storedRole);
    }
  }, []);

  // Fetch events with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isError
  } = useQuery({
    queryKey: ['events', tab],
    queryFn: () => fetchEvents(tab),
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 30 * 1000,
    meta: {
      onError: (err: any) => {
        console.error("Event fetch error:", err);
        toast({
          title: "Failed to load events",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  });

  // Update local user role when data changes
  useEffect(() => {
    if (data?.userRole) {
      setLocalUserRole(data.userRole);
      localStorage.setItem('userRole', data.userRole);
    }
  }, [data?.userRole]);

  // Auto-retry in case of an error - but only once
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        console.log("Auto-retrying event fetch after error");
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isError, refetch]);

  // Create a new event
  const createEvent = async (eventData: Partial<EventFormData>) => {
    try {
      if (!eventData.title) {
        throw new Error("Event title is required");
      }
      
      if (!eventData.start_time || !eventData.end_time) {
        throw new Error("Event must have start and end times");
      }
      
      const result = await createEventService(eventData as EventFormData);
      
      toast({
        title: "Event Created",
        description: "Your event has been created successfully",
      });

      // Refetch with a delay to ensure the database has time to update
      setTimeout(() => {
        refetch();
      }, 500);
      
      return result;
    } catch (error: any) {
      console.error("Error creating event:", error);
      
      toast({
        title: "Failed to create event",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Respond to an event invitation
  const respondToInvitation = async (eventId: string, response: 'accepted' | 'declined') => {
    try {
      await respondToInvitationService(eventId, response);
      refetch();
      return true;
    } catch (error) {
      console.error("Error responding to invitation:", error);
      return false;
    }
  };

  // Filter events based on search and filters
  const getFilteredEvents = () => {
    const eventsList = data?.events || [];
    return eventsList.filter((event) => {
      // Search filter
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = filterStatus === "all" ? true : event.status === filterStatus;
      
      // Date filter
      const matchesDate = !filterDate ? true : new Date(event.start_time).toDateString() === filterDate.toDateString();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  // Get the actual user role from data, with a fallback to the state
  const userRole = data?.userRole || localUserRole;
  
  // Check if the user can create events (only individual and business accounts)
  const canCreateEvents = userRole === 'individual' || userRole === 'business';

  return {
    events: data?.events || [],
    userRole,
    filteredEvents: getFilteredEvents(),
    canCreateEvents,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    createEvent,
    respondToInvitation,
    refetch
  };
};
