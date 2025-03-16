
import React from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobs.types";
import { formatCurrency } from "@/utils/formatUtils";
import { Clock, DollarSign, Edit, Trash } from "lucide-react";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{job.name}</CardTitle>
          {job.duration && (
            <Badge variant="secondary" className="ml-2">
              <Clock className="h-3 w-3 mr-1" />
              {job.duration} min
            </Badge>
          )}
        </div>
        {job.default_price && (
          <CardDescription className="flex items-center mt-1">
            <DollarSign className="h-3 w-3" />
            {formatCurrency(job.default_price)}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow text-sm">
        {job.description ? (
          <p className="text-muted-foreground">{job.description}</p>
        ) : (
          <p className="text-muted-foreground italic">No description</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => onEdit(job)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => onDelete(job.id)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
