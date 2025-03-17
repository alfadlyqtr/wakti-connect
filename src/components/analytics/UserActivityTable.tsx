
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock, XCircle } from "lucide-react";

const mockActivityData = [
  {
    id: "act1",
    user: { name: "Alex Smith", avatar: "" },
    action: "completed",
    item: "Project Proposal",
    time: "10 minutes ago"
  },
  {
    id: "act2",
    user: { name: "Sarah Johnson", avatar: "" },
    action: "assigned",
    item: "Client Meeting",
    time: "1 hour ago"
  },
  {
    id: "act3",
    user: { name: "Michael Brown", avatar: "" },
    action: "created",
    item: "Monthly Report",
    time: "3 hours ago"
  },
  {
    id: "act4",
    user: { name: "Jessica Lee", avatar: "" },
    action: "updated",
    item: "Marketing Plan",
    time: "Yesterday"
  },
];

export const UserActivityTable: React.FC = () => {
  // Function to get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "assigned":
      case "created":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "deleted":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };
  
  // Function to get action text
  const getActionText = (action: string, item: string) => {
    switch (action) {
      case "completed":
        return <>Completed <span className="font-medium">{item}</span></>;
      case "assigned":
        return <>Was assigned <span className="font-medium">{item}</span></>;
      case "created":
        return <>Created <span className="font-medium">{item}</span></>;
      case "updated":
        return <>Updated <span className="font-medium">{item}</span></>;
      case "deleted":
        return <>Deleted <span className="font-medium">{item}</span></>;
      default:
        return <>{action} <span className="font-medium">{item}</span></>;
    }
  };
  
  return (
    <div className="space-y-4">
      {mockActivityData.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-medium">{activity.user.name}</p>
              <div className="flex items-center ml-2">
                {getActionIcon(activity.action)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {getActionText(activity.action, activity.item)}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
