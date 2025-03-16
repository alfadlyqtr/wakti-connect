
import React from "react";

const FeaturesComparisonTable = () => {
  return (
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
            <td className="py-4 px-6 font-medium" colSpan={4}>
              <span className="font-bold">Task Management</span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Create & Edit Tasks</td>
            <td className="py-4 px-6 text-center">1/month</td>
            <td className="py-4 px-6 text-center">Unlimited</td>
            <td className="py-4 px-6 text-center">Unlimited</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Task Prioritization</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Share Tasks</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Assign Tasks to Team</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          
          <tr className="border-b">
            <td className="py-4 px-6 font-medium" colSpan={4}>
              <span className="font-bold">Appointments</span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Schedule Appointments</td>
            <td className="py-4 px-6 text-center">View Only</td>
            <td className="py-4 px-6 text-center">✓</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Booking Page</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Service Management</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          
          <tr className="border-b">
            <td className="py-4 px-6 font-medium" colSpan={4}>
              <span className="font-bold">Team & Business</span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Staff Management</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Business Profile</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">TMW AI Chatbot</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">—</td>
            <td className="py-4 px-6 text-center">✓</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6">Support</td>
            <td className="py-4 px-6 text-center">Email</td>
            <td className="py-4 px-6 text-center">Priority</td>
            <td className="py-4 px-6 text-center">Premium</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeaturesComparisonTable;
