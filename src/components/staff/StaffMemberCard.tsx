
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserCog, UserCheck, UserX, Trash2 } from "lucide-react";

interface StaffData {
  id: string;
  name: string;
  email: string;
  position?: string;
  role: string;
  is_service_provider: boolean;
  staff_number?: string;
  status: string;
  created_at: string;
  profiles?: {
    avatar_url?: string;
    full_name?: string;
  };
}

interface StaffMemberCardProps {
  data: StaffData;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const isActive = data.status === "active";
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const createdAt = new Date(data.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Card className={`${!isActive ? "opacity-75" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={data.profiles?.avatar_url || ""} alt={data.name} />
              <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold">{data.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <UserCog className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus}>
                {isActive ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Suspend
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Position</p>
            <p>{data.position || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="capitalize">{data.role}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-3 border-t">
        <Badge variant={data.is_service_provider ? "default" : "outline"}>
          {data.is_service_provider ? "Service Provider" : "Staff"}
        </Badge>
        <Badge variant={isActive ? "success" : "destructive"} className="capitalize">
          {data.status}
        </Badge>
      </CardFooter>
    </Card>
  );
};
