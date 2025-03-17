
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const UserActivityTable: React.FC = () => {
  const activities = [
    {
      id: "1",
      user: {
        name: "Ahmed",
        avatar: "/placeholder.svg"
      },
      action: "Completed task",
      subject: "Website redesign",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: "2",
      user: {
        name: "Sara",
        avatar: "/placeholder.svg"
      },
      action: "Started task",
      subject: "Content writing",
      time: "3 hours ago",
      status: "in-progress"
    },
    {
      id: "3",
      user: {
        name: "John",
        avatar: "/placeholder.svg"
      },
      action: "Created task",
      subject: "Social media campaign",
      time: "5 hours ago",
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": return "bg-amber-500";
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4 rounded-md p-2 hover:bg-muted">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}
            </p>
            <p className="text-sm text-muted-foreground">{activity.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(activity.status)}>
              {activity.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
