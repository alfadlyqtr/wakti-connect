
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  errorMessage: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Booking Not Found</CardTitle>
          <CardDescription>
            {errorMessage || "Sorry, we couldn't find the booking you're looking for. It may have been cancelled or the link is incorrect."}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorState;
