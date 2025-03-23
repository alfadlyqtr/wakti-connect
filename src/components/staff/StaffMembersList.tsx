
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { StaffMember } from "@/types/staff";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffMemberCard } from "@/components/staff/StaffMemberCard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface StaffMembersListProps {
  staffMembers: StaffMember[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onUpdateStatus?: (staffId: string, status: string) => void;
}

export const StaffMembersList: React.FC<StaffMembersListProps> = ({
  staffMembers,
  isLoading,
  error,
  onEdit,
  onUpdateStatus
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-6" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading staff members</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to load staff members. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  // No staff members state
  if (!staffMembers || staffMembers.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-2">No staff members found</p>
        <p className="text-sm">Start by creating your first staff member account.</p>
      </Card>
    );
  }

  // Render staff list
  return (
    <div className="space-y-4">
      {staffMembers.map((staff) => (
        <StaffMemberCard
          key={staff.id}
          member={staff}
          onEdit={() => onEdit(staff.id)}
          onDelete={() => console.log("Delete", staff.id)}
          onToggleStatus={() => {
            if (onUpdateStatus) {
              const newStatus = staff.status === 'active' ? 'inactive' : 'active';
              onUpdateStatus(staff.id, newStatus);
            }
          }}
        />
      ))}
    </div>
  );
};

export default StaffMembersList;
