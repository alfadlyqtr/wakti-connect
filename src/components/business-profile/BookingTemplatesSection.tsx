
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookingTemplate {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
}

interface BookingTemplatesSectionProps {
  templates: BookingTemplate[];
  businessId: string;
}

const BookingTemplatesSection: React.FC<BookingTemplatesSectionProps> = ({ templates, businessId }) => {
  if (!templates || templates.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Booking Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <div className="p-4">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {template.duration} min
                  </div>
                  {template.price !== null && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {template.price}
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full mt-4" 
                  size="sm"
                  asChild
                >
                  <Link to={`/booking/${businessId}/${template.id}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingTemplatesSection;
