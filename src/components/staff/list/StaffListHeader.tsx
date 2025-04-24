
import React from "react";

const StaffListHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-muted rounded-t-lg font-medium">
      <div className="col-span-3">Name</div>
      <div className="col-span-3">Email</div>
      <div className="col-span-2">Role</div>
      <div className="col-span-2">Status</div>
      <div className="col-span-2 text-right">Actions</div>
    </div>
  );
};

export default StaffListHeader;
