
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobs.types";
import { formatCurrency } from "@/utils/formatUtils";
import { Clock, DollarSign, Edit, Trash2 } from "lucide-react";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  isEditable?: boolean; // Added isEditable as an optional prop
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, isEditable = true }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{job.name}</CardTitle>
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
          onClick={() => onEdit(job)}
          disabled={!isEditable}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(job.id)}
          disabled={!isEditable}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
