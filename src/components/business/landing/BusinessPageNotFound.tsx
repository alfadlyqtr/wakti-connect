
import React from "react";

const BusinessPageNotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Business Page Not Found</h1>
      <p className="text-muted-foreground">
        The business page you're looking for doesn't exist or has been removed.
      </p>
    </div>
  );
};

export default BusinessPageNotFound;
