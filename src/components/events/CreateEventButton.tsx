
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface CreateEventButtonProps {
  startDate?: Date;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ 
  startDate = new Date(),
  variant = 'default'
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Format the date as ISO string for the query parameter
    const dateParam = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    navigate(`/dashboard/events/create?date=${dateParam}`);
  };
  
  return (
    <Button 
      variant={variant}
      size="sm"
      onClick={handleClick}
    >
      <CalendarPlus className="h-4 w-4 mr-1" />
      Event
    </Button>
  );
};

export default CreateEventButton;
