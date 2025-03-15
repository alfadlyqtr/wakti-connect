
import React, { useState, useEffect } from "react";
import { Plus, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppointmentCard from "@/components/ui/AppointmentCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const DashboardAppointments = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }
          
          if (profileData?.account_type) {
            setUserRole(profileData.account_type as "free" | "individual" | "business");
            console.log("Appointments page - user role:", profileData.account_type);
            
            // If the user has a paid account, fetch their appointments
            if (profileData.account_type === "individual" || profileData.account_type === "business") {
              fetchAppointments(session.user.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .order('start_time', { ascending: true });
        
        if (error) {
          console.error("Error fetching appointments:", error);
          toast({
            title: "Failed to load appointments",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setAppointments(data);
          console.log("Appointments loaded:", data.length);
        }
      } catch (error) {
        console.error("Error in fetchAppointments:", error);
      }
    };

    getUserRole();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in Appointments:", event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUserRole();
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setAppointments([]);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Filter appointments based on search
  const filteredAppointments = appointments.filter((appointment) => {
    return searchQuery 
      ? appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appointment.description && appointment.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (appointment.location && appointment.location.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
  });

  const handleCreateAppointment = async () => {
    if (!isPaidAccount) return;
    
    // This is a simple placeholder. In a real implementation,
    // you would open a modal to create a new appointment
    toast({
      title: "Create Appointment",
      description: "Appointment creation form would open here",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Schedule and manage your appointments.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          Schedule and manage your appointments.
        </p>
      </div>
      
      {isPaidAccount && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search appointments..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={handleCreateAppointment} className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Schedule Appointment</span>
          </Button>
        </div>
      )}
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                id={appointment.id}
                title={appointment.title}
                dateTime={new Date(appointment.start_time)}
                location={appointment.location || ""}
                status="confirmed" // This would be dynamic in a real implementation
                userRole={userRole || "free"}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <Calendar className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No appointments scheduled</h3>
            <p className="text-center text-sm text-muted-foreground max-w-xs">
              {isPaidAccount 
                ? "You haven't scheduled any appointments yet. Create a new appointment to get started."
                : "Free accounts can only view appointments. Upgrade to create and manage appointments."}
            </p>
            {isPaidAccount ? (
              <Button onClick={handleCreateAppointment} className="flex items-center gap-2">
                <Plus size={16} />
                Schedule Appointment
              </Button>
            ) : (
              <div className="text-center">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 mb-2">
                  View Only
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Upgrade to create and manage appointments
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAppointments;
