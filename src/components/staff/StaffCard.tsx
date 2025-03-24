
import React from "react";
import { StaffWithSessions } from "@/hooks/useStaffData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Calendar } from "lucide-react";

interface StaffCardProps {
  staff: StaffWithSessions;
  isSelected: boolean;
  onClick: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ 
  staff, 
  isSelected,
  onClick 
}) => {
  const activeSessions = staff.sessions.filter(s => s.status === 'active');
  const hasActiveSessions = activeSessions.length > 0;
  
  // Group sessions by date
  const sessionsByDate = staff.sessions.reduce((acc, session) => {
    const date = new Date(session.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, any[]>);
  
  // Count of unique work days
  const workDaysCount = Object.keys(sessionsByDate).length;
  
  // Avatar border class based on active work session - this color indicates
  // whether the staff member is actively clocked in (green) or not (red)
  const avatarBorderClass = hasActiveSessions 
    ? "ring-2 ring-green-500" 
    : "ring-2 ring-red-500";
  
  return (
    <Card 
      className={`
        cursor-pointer hover:border-primary transition-colors
        ${isSelected ? 'border-primary ring-1 ring-primary' : ''}
        ${hasActiveSessions ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : ''}
      `}
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <Avatar className={`h-10 w-10 ${avatarBorderClass}`}>
            <AvatarFallback>
              {staff.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Badge variant={staff.role === "admin" ? "secondary" : "outline"}>
            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
          </Badge>
        </div>
        <h3 className="font-medium mt-2">{staff.name}</h3>
        {staff.email && (
          <p className="text-xs text-muted-foreground">{staff.email}</p>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Sessions: {staff.sessions.length}</span>
            </div>
            
            {hasActiveSessions && (
              <Badge variant="success" className="bg-green-500">Active</Badge>
            )}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Work days: {workDaysCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
