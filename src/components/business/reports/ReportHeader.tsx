
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportHeaderProps {
  onDownload: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ onDownload }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Business Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your business performance and analyze key metrics.</p>
      </div>
      <Button className="md:self-start" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download Report
      </Button>
    </div>
  );
};
