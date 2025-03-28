
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
            {errorMessage || "The requested booking information could not be found."}
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
