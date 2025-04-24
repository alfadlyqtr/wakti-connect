
import React from "react";
import StaffManagementTab from "./StaffManagementTab";

const StaffManagementPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
      <div className="bg-card rounded-lg shadow p-6">
        <StaffManagementTab />
      </div>
    </div>
  );
};

export default StaffManagementPanel;
