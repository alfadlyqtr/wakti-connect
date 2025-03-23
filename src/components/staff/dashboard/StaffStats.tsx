
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Calendar, Clock, Briefcase } from "lucide-react";

interface StaffStatsProps {
  stats: {
    tasksCount: number;
    bookingsCount: number;
    workLogsCount: number;
    jobCardsCount: number;
  } | null;
  permissions: Record<string, boolean | undefined>;
}

const StaffStats: React.FC<StaffStatsProps> = ({ stats, permissions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {permissions.can_view_tasks && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-wakti-blue" />
              Tasks
            </CardTitle>
            <CardDescription>Assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.tasksCount || 0}</p>
          </CardContent>
        </Card>
      )}
      
      {permissions.can_manage_bookings && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-wakti-blue" />
              Bookings
            </CardTitle>
            <CardDescription>Your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.bookingsCount || 0}</p>
          </CardContent>
        </Card>
      )}
      
      {permissions.can_track_hours && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-wakti-blue" />
              Work Logs
            </CardTitle>
            <CardDescription>Your work sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.workLogsCount || 0}</p>
          </CardContent>
        </Card>
      )}
      
      {permissions.can_create_job_cards && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-wakti-blue" />
              Job Cards
            </CardTitle>
            <CardDescription>Completed jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.jobCardsCount || 0}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffStats;
