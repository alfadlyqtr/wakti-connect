
import React, { useEffect } from "react";
import { useBusinessReports } from "@/hooks/useBusinessReports";
import { accountTypeVerification } from "@/utils/accountTypeVerification";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { RevenueOverview } from "@/components/business/RevenueOverview";
import { ReportHeader } from "@/components/business/reports/ReportHeader";
import { StatsSummary } from "@/components/business/reports/StatsSummary";
import { ReportsTabs } from "@/components/business/reports/ReportsTabs";

const DashboardBusinessReports = () => {
  const {
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading
  } = useBusinessReports();
  
  const navigate = useNavigate();

  // Verify that the user has a business account when accessing this page
  useEffect(() => {
    const verifyBusinessAccount = async () => {
      const isBusinessAccount = await accountTypeVerification.verifyAccountType('business');
      
      if (!isBusinessAccount) {
        toast({
          title: "Access Denied",
          description: "You need a business account to access reports.",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    };
    
    verifyBusinessAccount();
  }, [navigate]);

  const handleDownloadReport = () => {
    // This would generate a report file in a real application
    console.log("Downloading report...");
  };

  return (
    <div className="container py-4 sm:py-6 space-y-4 sm:space-y-6 px-2 sm:px-4">
      <ReportHeader onDownload={handleDownloadReport} />

      <StatsSummary 
        subscriberCount={subscriberCount}
        subscribersLoading={subscribersLoading}
        staffCount={staffCount}
        staffLoading={staffLoading}
      />

      <ReportsTabs />

      <RevenueOverview 
        serviceCount={serviceCount}
        servicesLoading={servicesLoading}
        onDownload={handleDownloadReport}
      />
    </div>
  );
};

export default DashboardBusinessReports;
