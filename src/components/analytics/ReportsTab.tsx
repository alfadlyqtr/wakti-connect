
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Download, Printer, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportsTab = () => {
  const isMobile = useIsMobile();
  
  const handleGenerateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report...`);
    // In a real app, this would generate and download the report
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="financial">
        <TabsList className="flex overflow-x-auto space-x-1 py-1 px-1">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="mt-4 sm:mt-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-5 w-5" />
                  Monthly Revenue Report
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of monthly revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This report includes total revenue, service-wise breakdown, payment methods, and trends compared to previous periods.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('monthly-revenue')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('monthly-revenue-print')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-5 w-5" />
                  Annual Financial Summary
                </CardTitle>
                <CardDescription>
                  Year-to-date financial performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This report provides a comprehensive overview of your annual revenue, expenses, and profit margins with quarter-by-quarter comparison.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('annual-summary')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('annual-summary-print')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-4 sm:mt-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CalendarDays className="h-5 w-5" />
                  Appointment Analysis
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of appointments by service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This report shows appointment trends, popular time slots, most booked services, and customer retention metrics.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('appointment-analysis')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('appointment-analysis-print')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CalendarDays className="h-5 w-5" />
                  No-Show Report
                </CardTitle>
                <CardDescription>
                  Analysis of appointment cancellations and no-shows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This report identifies patterns in cancellations and no-shows, helping you optimize your scheduling and reminder systems.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('no-show-report')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('no-show-report-print')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-4 sm:mt-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-5 w-5" />
                  Staff Performance
                </CardTitle>
                <CardDescription>
                  Individual staff productivity and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This report provides detailed performance metrics for each staff member, including appointments handled, revenue generated, and customer feedback scores.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('staff-performance')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('staff-performance-print')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-5 w-5" />
                  Work Hours Summary
                </CardTitle>
                <CardDescription>
                  Staff working hours and attendance report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This report summarizes staff attendance, work hours, overtime, and productivity metrics to help with scheduling and payroll.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('work-hours-summary')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleGenerateReport('work-hours-summary-print')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsTab;
