
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

// Define our SimpleGuestResponse type for this component
interface SimpleGuestResponse {
  id?: string;
  event_id: string;
  name: string;
  response: 'accepted' | 'declined';
  created_at?: string;
}

interface EventViewResponsesProps {
  responses?: SimpleGuestResponse[];
}

const EventViewResponses: React.FC<EventViewResponsesProps> = ({ responses = [] }) => {
  const acceptedCount = responses.filter(r => r.response === 'accepted').length;
  const declinedCount = responses.filter(r => r.response === 'declined').length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guest Responses</CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <p className="text-muted-foreground">No responses yet.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
              <div className="border rounded-md p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{declinedCount}</div>
                <div className="text-sm text-muted-foreground">Declined</div>
              </div>
            </div>
            
            <div className="space-y-1 mt-4">
              <h3 className="font-medium">Guest List</h3>
              <ul className="divide-y">
                {responses.map((response) => (
                  <li key={response.id || `${response.name}-${response.response}`} 
                      className="py-2 flex justify-between items-center">
                    <span className="font-medium">{response.name}</span>
                    {response.response === 'accepted' ? (
                      <span className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Going
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <X className="h-4 w-4 mr-1" />
                        Not Going
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventViewResponses;
