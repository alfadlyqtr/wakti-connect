import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
// Update import to use formatDateAndTime instead of formatDateTime
import { formatDateAndTime } from "@/utils/dateUtils";

interface WorkHistoryProps {
  staffRelationId: string;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ staffRelationId }) => {
  const [workLogs, setWorkLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkLogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/staff/work-logs?staff_relation_id=${staffRelationId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorkLogs(data);
      } catch (e: any) {
        setError(`Failed to load work logs: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkLogs();
  }, [staffRelationId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          Loading work history...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  if (workLogs.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">No work history recorded.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-border">
            {workLogs.map((log: any) => (
              <div key={log.id} className="p-4">
                <div className="font-medium">
                  {formatDateAndTime(log.start_time)} - {log.end_time ? formatDateAndTime(log.end_time) : "Ongoing"}
                </div>
                {log.notes && <div className="text-sm mt-1">Notes: {log.notes}</div>}
                {log.earnings !== null && <div className="text-sm">Earnings: ${log.earnings.toFixed(2)}</div>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WorkHistory;
