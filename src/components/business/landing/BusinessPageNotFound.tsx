
import React from "react";

interface BusinessPageNotFoundProps {
  slug?: string;
}

const BusinessPageNotFound: React.FC<BusinessPageNotFoundProps> = ({ slug }) => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Business Page Not Found</h1>
      <p className="text-muted-foreground">
        {slug 
          ? `The business page "${slug}" could not be found or does not exist.`
          : "The business page you're looking for could not be found."
        }
      </p>
    </div>
  );
};

export default BusinessPageNotFound;
