
import React from "react";

const DashboardFallback = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] p-4">
    <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
    <p className="text-muted-foreground mb-4 text-center">
      We encountered an issue loading the dashboard. This has been reported.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
    >
      Refresh Page
    </button>
  </div>
);

export default DashboardFallback;
