
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, AlertTriangle, UserPlus, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  position?: string;
  role: string;
  is_service_provider: boolean;
  status: string;
  profiles?: {
    avatar_url?: string;
    full_name?: string;
  } | null;
}

interface StaffListProps {
  staffMembers: StaffMember[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onRefresh: () => void;
}

export function StaffList({ 
  staffMembers, 
  isLoading, 
  error, 
  onEdit,
  onRefresh
}: StaffListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 flex flex-col items-center text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load staff members</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={onRefresh}>Try Again</Button>
      </Card>
    );
  }

  if (staffMembers.length === 0) {
    return (
      <Card className="p-8 flex flex-col items-center text-center">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No staff members yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Add your first staff member to help manage your business. Staff members can help with tasks, bookings, and more.
        </p>
        <Button onClick={() => onEdit("")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {staffMembers.map((staff) => (
        <StaffCard 
          key={staff.id} 
          staff={staff} 
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
}

function StaffCard({ staff, onEdit }: { staff: StaffMember; onEdit: (id: string) => void }) {
  const fullName = staff.profiles?.full_name || staff.name;
  const avatarUrl = staff.profiles?.avatar_url || "";
  const initials = fullName
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
    
  const isActive = staff.status === 'active';
  
  return (
    <Card className={!isActive ? "opacity-70" : undefined}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{fullName}</CardTitle>
              <CardDescription>{staff.position || "Staff Member"}</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {staff.role === 'co-admin' && (
              <Badge variant="secondary">Co-Admin</Badge>
            )}
            {staff.is_service_provider && (
              <Badge variant="outline">Service Provider</Badge>
            )}
            {!isActive && (
              <Badge variant="destructive">Suspended</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{staff.email}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full" 
          onClick={() => onEdit(staff.id)}
        >
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Edit Staff
        </Button>
      </CardFooter>
    </Card>
  );
}
