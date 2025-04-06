
import React, { useState } from "react";
import { Task } from "@/types/task.types";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  CheckCircle2, 
  Clock,
  CalendarDays,
  Share2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { ar } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface ShareTabContentProps {
  tasks: Task[];
  loading: boolean;
}

export const ShareTabContent: React.FC<ShareTabContentProps> = ({
  tasks,
  loading
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [filter, setFilter] = useState<"all" | "shared-by-me" | "shared-with-me">("all");
  
  if (loading) {
    return <div className="p-8 text-center">{t('common.loading')}...</div>;
  }
  
  if (tasks.length === 0) {
    return <EmptyState activeTab="shared" />;
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: isRTL ? ar : undefined
    });
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-r-none",
              filter === "all" ? "bg-muted" : ""
            )}
          >
            {t('tasks.shared.all')}
          </button>
          <button
            onClick={() => setFilter("shared-by-me")}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-none border-x-0",
              filter === "shared-by-me" ? "bg-muted" : ""
            )}
          >
            {t('tasks.shared.byMe')}
          </button>
          <button
            onClick={() => setFilter("shared-with-me")}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-l-none",
              filter === "shared-with-me" ? "bg-muted" : ""
            )}
          >
            {t('tasks.shared.withMe')}
          </button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{task.title}</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  <span>{t('tasks.shared.text')}</span>
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(task.created_at)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm line-clamp-2">{task.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{t('tasks.owner')}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${getStatusColor(task.status)}`}></span>
                  <span className="text-xs font-medium">
                    {t(`tasks.status.${task.status}`)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {task.due_date}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {task.shared_with ? task.shared_with.length : 0}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
