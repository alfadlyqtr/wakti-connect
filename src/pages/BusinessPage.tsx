
import React from "react";
import { useParams } from "react-router-dom";

const BusinessPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Business: {businessSlug}</h1>
      <p>This is the public business page for {businessSlug}</p>
    </div>
  );
};

export default BusinessPage;
