
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FeaturePlanComparison = () => {
  const features = [
    {
      name: "Task Management",
      free: "View Only",
      individual: true,
      business: true,
    },
    {
      name: "Task Sharing",
      free: false,
      individual: true,
      business: true,
    },
    {
      name: "Appointment Scheduling",
      free: "View Only",
      individual: true,
      business: true,
    },
    {
      name: "Custom Event Creation",
      free: false,
      individual: true,
      business: true,
    },
    {
      name: "Business Booking Pages",
      free: false,
      individual: false,
      business: true,
    },
    {
      name: "Staff Management",
      free: false,
      individual: false,
      business: true,
    },
    {
      name: "Business Analytics",
      free: false,
      individual: "Basic",
      business: "Advanced",
    },
  ];

  const renderStatus = (status: boolean | string) => {
    if (typeof status === "boolean") {
      return status ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-center block">{status}</span>;
  };

  return (
    <SectionContainer className="py-16">
      <h2 className="text-3xl font-bold text-center mb-6">Plan Comparison</h2>
      <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
        Choose the plan that's right for you and your team. Upgrade or downgrade anytime.
      </p>

      <div className="rounded-lg border overflow-hidden mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Feature</TableHead>
              <TableHead className="text-center">Free</TableHead>
              <TableHead className="text-center">Individual</TableHead>
              <TableHead className="text-center">Business</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell className="text-center">
                  {renderStatus(feature.free)}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatus(feature.individual)}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatus(feature.business)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link to="/pricing">View Full Pricing Details</Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default FeaturePlanComparison;
