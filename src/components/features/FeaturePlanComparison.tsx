
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";

const FeaturePlanComparison = () => {
  return (
    <SectionContainer className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-10">Compare Plans</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 text-left">Feature</th>
              <th className="py-4 px-6 text-center">Free</th>
              <th className="py-4 px-6 text-center">Individual</th>
              <th className="py-4 px-6 text-center">Business</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 px-6 font-medium">Task Management</td>
              <td className="py-4 px-6 text-center">View Only</td>
              <td className="py-4 px-6 text-center">Full Access</td>
              <td className="py-4 px-6 text-center">Team Access</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6 font-medium">Appointment Booking</td>
              <td className="py-4 px-6 text-center">View Only</td>
              <td className="py-4 px-6 text-center">Full Access</td>
              <td className="py-4 px-6 text-center">Business-wide</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6 font-medium">Messaging</td>
              <td className="py-4 px-6 text-center">—</td>
              <td className="py-4 px-6 text-center">Limited</td>
              <td className="py-4 px-6 text-center">Full Access</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6 font-medium">Business Dashboard</td>
              <td className="py-4 px-6 text-center">—</td>
              <td className="py-4 px-6 text-center">—</td>
              <td className="py-4 px-6 text-center">Full Access</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6 font-medium">Staff Management</td>
              <td className="py-4 px-6 text-center">—</td>
              <td className="py-4 px-6 text-center">—</td>
              <td className="py-4 px-6 text-center">Full Access</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center mt-8">
        <Button asChild>
          <Link to="/pricing">View Full Pricing Details</Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default FeaturePlanComparison;
