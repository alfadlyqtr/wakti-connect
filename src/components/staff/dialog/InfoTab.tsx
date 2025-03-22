
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  Shield, 
  List, 
  MessageSquare, 
  CalendarCheck, 
  Clock, 
  CreditCard, 
  BarChart4
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const InfoTab: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="h-5 w-5" /> Staff Management Information
        </h3>
        <p className="text-muted-foreground">
          Staff accounts allow team members to access your business dashboard with specific permissions.
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-6">
        <h4 className="text-lg font-medium flex items-center gap-2">
          <Shield className="h-5 w-5" /> Staff Roles
        </h4>
        
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4 grid grid-cols-[auto_1fr] gap-4">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h5 className="font-medium mb-1">Staff Member</h5>
                <p className="text-sm text-muted-foreground">
                  Regular staff with limited access based on assigned permissions.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 grid grid-cols-[auto_1fr] gap-4">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h5 className="font-medium mb-1">Co-Admin</h5>
                <p className="text-sm text-muted-foreground">
                  Co-Admin has additional privileges to manage the business. Limited to one Co-Admin per business.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-6">
        <h4 className="text-lg font-medium">Permission Categories</h4>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <List className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Tasks</h5>
              <p className="text-sm text-muted-foreground">
                View assigned tasks or manage all tasks (create, edit, delete).
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Messaging</h5>
              <p className="text-sm text-muted-foreground">
                Send and receive messages with other staff members within the business.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Bookings</h5>
              <p className="text-sm text-muted-foreground">
                Manage customer bookings, appointments, and service schedules.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Work Hours & Earnings</h5>
              <p className="text-sm text-muted-foreground">
                Track working hours and log daily earnings for walk-in customers.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Job Cards</h5>
              <p className="text-sm text-muted-foreground">
                Create and manage job cards for customer services and track progress.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <BarChart4 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Analytics</h5>
              <p className="text-sm text-muted-foreground">
                View business analytics and performance metrics (read-only access).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;
