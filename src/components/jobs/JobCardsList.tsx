
import React from "react";
import { useJobCards } from "@/hooks/useJobCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";
import { FileText } from "lucide-react";

interface JobCardsListProps {
  staffRelationId: string;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const { jobCards, isLoading } = useJobCards(staffRelationId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!jobCards || jobCards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Job Cards Yet</h3>
          <p className="text-muted-foreground">
            Start a work session and create your first job card.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Cards</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobCards.map(jobCard => {
              // Calculate duration
              let duration = "In progress";
              if (jobCard.end_time) {
                const start = new Date(jobCard.start_time);
                const end = new Date(jobCard.end_time);
                const durationMs = end.getTime() - start.getTime();
                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                
                if (durationHours > 0) {
                  duration = `${durationHours}h ${durationMinutes}m`;
                } else {
                  duration = `${durationMinutes}m`;
                }
              }
              
              return (
                <TableRow key={jobCard.id}>
                  <TableCell className="font-medium">
                    {jobCard.job?.name || "Unknown Job"}
                  </TableCell>
                  <TableCell>{formatDateTime(jobCard.start_time)}</TableCell>
                  <TableCell>{duration}</TableCell>
                  <TableCell>
                    {jobCard.payment_method === 'none' 
                      ? "No payment" 
                      : `${formatCurrency(jobCard.payment_amount)} (${jobCard.payment_method.toUpperCase()})`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobCardsList;
