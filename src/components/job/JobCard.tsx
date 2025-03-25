
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job.types';
import { formatCurrency } from '@/utils/formatUtils';
import { Clock, DollarSign, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
  hasActiveCards?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, hasActiveCards = false }) => {
  return (
    <Card className={hasActiveCards ? "border-yellow-300 dark:border-yellow-700" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{job.name}</CardTitle>
          {hasActiveCards && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This job has active job cards. Cannot edit or delete.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
          disabled={hasActiveCards}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={hasActiveCards}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
