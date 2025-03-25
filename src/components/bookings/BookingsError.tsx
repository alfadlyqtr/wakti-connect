
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QueryClient } from "@tanstack/react-query";

interface BookingsErrorProps {
  error: Error;
  queryClient: QueryClient;
}

const BookingsError: React.FC<BookingsErrorProps> = ({ error, queryClient }) => {
  return (
    <div className="container py-8">
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-500 mb-2">Error loading bookings</div>
          <p className="text-muted-foreground">{error.message}</p>
          <Button 
            className="mt-4" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsError;
