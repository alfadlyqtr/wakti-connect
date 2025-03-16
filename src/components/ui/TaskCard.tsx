
import React from "react";
import { CheckCircle2, Clock, AlertCircle, MoreVertical, Share2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type TaskStatus = "pending" | "in-progress" | "completed" | "late";
export type TaskPriority = "urgent" | "high" | "medium" | "normal";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  userRole?: "free" | "individual" | "business";
  isAssigned?: boolean;
  isShared?: boolean;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  status,
  priority,
  category,
  userRole = "free",
  isAssigned = false,
  isShared = false
}: TaskCardProps) => {
  // Status Icon Component
  const StatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "late":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  // Status and Priority Badge colors
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "late":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default:
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "personal":
        return "bg-wakti-blue/10 text-wakti-blue hover:bg-wakti-blue/20";
      case "shared":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "assigned":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      default:
        return "bg-wakti-blue/10 text-wakti-blue hover:bg-wakti-blue/20";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isPaidAccount = userRole === "individual" || userRole === "business";

  return (
    <Card className={cn(
      "task-card group transition-all duration-300",
      status === "completed" && "opacity-80",
      "hover:shadow-md hover:border-primary/20"
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <StatusIcon />
          <h3 className={cn(
            "font-medium text-base transition-all duration-200",
            status === "completed" && "line-through text-muted-foreground"
          )}>
            {title}
          </h3>
        </div>
        {isPaidAccount ? (
          <div className="flex items-center">
            {isShared && (
              <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-500 text-xs">
                <Share2 className="h-3 w-3 mr-1" />
                Shared
              </Badge>
            )}
            {isAssigned && (
              <Badge variant="outline" className="mr-2 bg-emerald-500/10 text-emerald-500 text-xs">
                <UserCheck className="h-3 w-3 mr-1" />
                Assigned
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Task menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                {status !== "completed" ? (
                  <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                )}
                
                {userRole === "individual" && !isShared && !isAssigned && (
                  <DropdownMenuItem>Share Task</DropdownMenuItem>
                )}
                
                {userRole === "business" && !isAssigned && (
                  <DropdownMenuItem>Assign to Staff</DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
            View Only
          </Badge>
        )}
      </CardHeader>
      
      {description && (
        <CardContent className="p-4 pt-2 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
      )}
      
      <CardFooter className="p-4 pt-2 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={cn("text-xs", getStatusColor(status))}>
            {status.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
            {priority}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", getCategoryColor(category))}>
            {category}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(dueDate)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
