
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { id: "1", title: "Improving Business Efficiency", date: "2 days ago" },
    { id: "2", title: "Marketing Strategy Ideas", date: "1 week ago" },
    { id: "3", title: "Creating a Study Plan", date: "2 weeks ago" }
  ];

  // Adjust styling for compact mode
  const getHeaderClasses = () => {
    return compact ? "pb-2" : "pb-2 sm:pb-3";
  };

  const getIconClasses = () => {
    return compact ? "h-4 w-4 mr-1.5" : "h-5 w-5 mr-2";
  };

  const getTitleClasses = () => {
    return compact ? "text-base" : "text-xl";
  };
  
  return (
    <Card className="w-full">
      <CardHeader className={getHeaderClasses()}>
        <CardTitle className={`flex items-center ${getTitleClasses()}`}>
          <History className={getIconClasses()} />
          {compact ? "Recent Conversations" : "Conversation History"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleHistory.length > 0 ? (
            <ul className="space-y-2">
              {sampleHistory.map((history) => (
                <li key={history.id} className="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h3 className="font-medium text-sm">{history.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {history.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Your conversation history will appear here</p>
            </div>
          )}
          
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View All Conversations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
