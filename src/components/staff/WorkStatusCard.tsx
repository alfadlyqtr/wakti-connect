
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface WorkStatusCardProps {
  activeWorkSession: any | null;
  onStartWorkDay: () => void;
  onEndWorkDay: () => void;
  onCreateJobCard: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "PPpp"); // Format: "Jan 1, 2021, 12:00 AM"
};

const getWorkingTime = (startTimeString: string): string => {
  const startTime = new Date(startTimeString);
  const now = new Date();
  
  const diffMillis = now.getTime() - startTime.getTime();
  const hours = Math.floor(diffMillis / (1000 * 60 * 60));
  const minutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

const WorkStatusCard: React.FC<WorkStatusCardProps> = ({
  activeWorkSession,
  onStartWorkDay,
  onEndWorkDay,
  onCreateJobCard
}) => {
  const [canCreateJobs, setCanCreateJobs] = useState(true);
  const [canTrackHours, setCanTrackHours] = useState(true);
  const [secondsCounter, setSecondsCounter] = useState(0);
  
  // Effect to check current user permissions
  useEffect(() => {
    const checkPermissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('permissions')
        .eq('staff_id', user.id)
        .maybeSingle();
        
      if (error || !data) {
        console.error("Error checking permissions:", error);
        return;
      }
      
      if (data.permissions) {
        setCanCreateJobs(!!data.permissions.can_create_job_cards);
        setCanTrackHours(!!data.permissions.can_track_hours);
      }
    };
    
    checkPermissions();
  }, []);
  
  // Timer effect to update working time counter
  useEffect(() => {
    if (!activeWorkSession) return;
    
    const timer = setInterval(() => {
      setSecondsCounter(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeWorkSession]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-wakti-blue" />
          Work Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeWorkSession ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-green-600 font-semibold flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Currently Working
              </span>
              <span className="text-sm text-muted-foreground">
                Started: {formatDate(activeWorkSession.start_time)}
              </span>
              <span className="font-medium mt-2">
                Time Elapsed: {getWorkingTime(activeWorkSession.start_time)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">
            <span className="flex items-center">
              <XCircle className="h-4 w-4 mr-1 text-red-500" />
              Not currently working
            </span>
            <p className="text-sm mt-2">
              Start your work day to track hours and create job cards.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-3 flex-wrap">
        {!activeWorkSession ? (
          <Button 
            onClick={onStartWorkDay}
            variant="default"
            className="flex-1"
            disabled={!canTrackHours}
          >
            <Clock className="h-4 w-4 mr-2" />
            Start Work Day
          </Button>
        ) : (
          <>
            <Button 
              onClick={onEndWorkDay}
              variant="outline"
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              End Work Day
            </Button>
            <Button 
              onClick={onCreateJobCard}
              disabled={!canCreateJobs}
              className="flex-1"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Job Card
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkStatusCard;
