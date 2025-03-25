
import React, { Suspense } from "react";
import LandingPage from "@/pages/public/LandingPage";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Index = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPage />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
