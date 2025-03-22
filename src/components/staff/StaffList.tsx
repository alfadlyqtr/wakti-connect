
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar, 
  DollarSign, 
  BadgeCheck, 
  UserX 
} from "lucide-react";
import { StaffWithSessions } from "@/hooks/useStaffWorkLogs";

interface StaffListProps {
  staffData?: StaffWithSessions[] | null;
  isLoading: boolean;
}

export const StaffList: React.FC<StaffListProps> = ({ staffData, isLoading }) => {
  const [expandedStaff, setExpandedStaff] = useState<string[]>([]);
  
  const toggleStaffExpanded = (staffId: string) => {
    setExpandedStaff(prevExpanded => 
      prevExpanded.includes(staffId)
        ? prevExpanded.filter(id => id !== staffId)
        : [...prevExpanded, staffId]
    );
  };
  
  if (isLoading) {
    return (
      <Card className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </Card>
    );
  }
  
  if (!staffData || staffData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Staff Found</h3>
          <p className="text-muted-foreground mb-4">You haven't added any staff members yet.</p>
          <Button>Add Staff Member</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {staffData.map(staff => {
        const hasRealAccount = staff.id !== staff.email; // If IDs are different, likely a real account
        const isExpanded = expandedStaff.includes(staff.id);
        const activeSessions = staff.sessions.filter(session => session.status === 'active');
        const hasActiveSession = activeSessions.length > 0;
        const lastSession = staff.sessions[0];
        
        // Calculate earnings for this month
        const currentDate = new Date();
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthlyEarnings = staff.sessions
          .filter(session => new Date(session.start_time) >= monthStart)
          .reduce((sum, session) => sum + (session.earnings || 0), 0);
        
        // Calculate number of work days this month
        const workDaysThisMonth = new Set(
          staff.sessions
            .filter(session => new Date(session.start_time) >= monthStart)
            .map(session => session.date)
        ).size;
        
        return (
          <Collapsible
            key={staff.id}
            open={isExpanded}
            onOpenChange={() => toggleStaffExpanded(staff.id)}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {staff.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{staff.name}</CardTitle>
                          {hasRealAccount && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <BadgeCheck className="h-3 w-3 mr-1" />
                              Account
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {isExpanded ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <div className="flex items-center mt-2 gap-2">
                  {hasActiveSession ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Currently Working
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Working</Badge>
                  )}
                  
                  {lastSession && (
                    <div className="text-xs text-muted-foreground">
                      Last active: {new Date(lastSession.start_time).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Work Days (Month)
                      </span>
                      <span className="font-medium">{workDaysThisMonth} days</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Earnings (Month)
                      </span>
                      <span className="font-medium">${monthlyEarnings.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Total Work Sessions
                      </span>
                      <span className="font-medium">{staff.sessions.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {hasActiveSession && (
                      <Button size="sm" variant="outline" className="text-red-500">
                        <UserX className="h-4 w-4 mr-2" />
                        End Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
};
