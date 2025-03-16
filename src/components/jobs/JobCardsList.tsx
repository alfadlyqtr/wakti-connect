
import React from "react";
import { useJobCards } from "@/hooks/useJobCards";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatUtils";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { Calendar, Clock, DollarSign, CreditCard, Banknote, Receipt } from "lucide-react";

interface JobCardsListProps {
  staffRelationId: string;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const { jobCards, isLoading } = useJobCards(staffRelationId);
  
  // Calculate total earnings for today
  const today = new Date().toISOString().split('T')[0];
  const todayCards = jobCards?.filter(card => 
    new Date(card.created_at).toISOString().split('T')[0] === today
  ) || [];
  
  const todayEarnings = todayCards.reduce((sum, card) => sum + card.payment_amount, 0);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!jobCards || jobCards.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg border-dashed">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-2">No job cards yet</h3>
        <p className="text-muted-foreground">
          Create your first job card by clicking "Create Job Card" above
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {todayCards.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{todayCards.length} job{todayCards.length !== 1 ? 's' : ''} completed</span>
              </div>
              <div className="flex items-center md:ml-auto">
                <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatCurrency(todayEarnings)} earned</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Recent Job Cards</h3>
        
        {jobCards.map(card => (
          <Card key={card.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <CardTitle className="text-base">
                  {card.job?.name || "Unknown Job"}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={card.payment_method === 'cash' ? 'default' : card.payment_method === 'pos' ? 'secondary' : 'outline'}>
                    {card.payment_method === 'cash' ? (
                      <Banknote className="h-3 w-3 mr-1" />
                    ) : card.payment_method === 'pos' ? (
                      <CreditCard className="h-3 w-3 mr-1" />
                    ) : null}
                    {card.payment_method === 'cash' ? 'Cash' : 
                      card.payment_method === 'pos' ? 'POS' : 'No Payment'}
                  </Badge>
                  <Badge variant="outline">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {formatCurrency(card.payment_amount)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(card.created_at)}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatTime(card.start_time)}</span>
                </div>
                
                {card.notes && (
                  <div className="md:col-span-2 mt-2 border-t pt-2">
                    <p className="text-sm line-clamp-2">{card.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobCardsList;
