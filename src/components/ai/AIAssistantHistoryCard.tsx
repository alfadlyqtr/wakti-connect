
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock } from "lucide-react";

interface AIAssistantHistoryCardProps {
  canAccess: boolean;
  compact?: boolean;
}

export const AIAssistantHistoryCard: React.FC<AIAssistantHistoryCardProps> = ({ 
  canAccess,
  compact = false
}) => {
  if (!canAccess) {
    return null;
  }

  // Sample history data - would be replaced with actual data in a real implementation
  const sampleHistory = [
    { id: "1", title: "How to improve task efficiency", date: "2 days ago" },
    { id: "2", title: "Marketing strategies for small business", date: "1 week ago" },
    { id: "3", title: "Study plan for biology exam", date: "2 weeks ago" }
  ];

  // Adjust styling for compact mode
  const getHeaderClasses = () => {
    return compact 
      ? "pb-2" 
      : "pb-2 sm:pb-3";
  };

  const getIconClasses = () => {
    return compact
      ? "h-4 w-4 mr-1.5"
      : "h-5 w-5 mr-2";
  };

  const getTitleClasses = () => {
    return compact
      ? "text-base"
      : "text-xl";
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm mb-1">
          <History className="h-4 w-4 mr-1.5" />
          <span className="font-medium">Recent Conversations</span>
        </div>
        <div className="space-y-2">
          {sampleHistory.map((item) => (
            <div 
              key={item.id}
              className="text-sm p-2 rounded-md border border-border hover:bg-accent cursor-pointer flex items-center justify-between"
            >
              <div className="truncate flex-1">{item.title}</div>
              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className={getHeaderClasses()}>
        <CardTitle className={`flex items-center ${getTitleClasses()}`}>
          <History className={getIconClasses()} />
          Conversation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sampleHistory.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-md border border-border hover:bg-accent cursor-pointer"
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
