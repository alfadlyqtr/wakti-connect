
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/jobs.types';
import { Clock, DollarSign, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';

interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
  isEditable?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, isEditable = true }) => {
  const { formatCurrency } = useCurrencyFormat();
  
  return (
    <Card className={!isEditable ? "border-amber-200 bg-amber-50/30 dark:border-amber-900 dark:bg-amber-900/10" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {job.name}
          {!isEditable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 ml-2 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This job is in use in an active job card</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {job.description && (
            <p className="text-muted-foreground">{job.description}</p>
          )}
          <div className="flex items-center text-muted-foreground">
            {job.duration && (
              <div className="flex items-center mr-4">
                <Clock className="w-4 h-4 mr-1" />
                <span>{job.duration} min</span>
              </div>
            )}
            {job.default_price && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>{formatCurrency(job.default_price)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit} 
          disabled={!isEditable}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDelete}
          disabled={!isEditable}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
