
import React from 'react';
import { JobCard } from '@/hooks/useJobCards';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface JobCardsListProps {
  jobCards: JobCard[];
  isLoading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const JobCardsList: React.FC<JobCardsListProps> = ({
  jobCards,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (jobCards.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/50">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-2">No job cards found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first job card to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatJobCardStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {jobCards.map((jobCard) => (
        <Card key={jobCard.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{jobCard.title}</h3>
                  <Badge variant={getStatusBadgeVariant(jobCard.status) as any}>
                    {formatJobCardStatus(jobCard.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Reference: {jobCard.reference}
                </div>
                <div className="text-sm">
                  Customer: {jobCard.customerName}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(jobCard.createdAt), { addSuffix: true })}
                </div>
                {jobCard.deadline && (
                  <div className="text-sm text-muted-foreground">
                    Due {formatDistanceToNow(new Date(jobCard.deadline), { addSuffix: true })}
                  </div>
                )}
                <div className="font-medium">
                  {formatCurrency(jobCard.totalAmount)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end md:self-center">
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(jobCard.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(jobCard.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
