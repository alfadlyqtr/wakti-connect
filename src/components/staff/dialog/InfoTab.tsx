
import React from "react";

const InfoTab: React.FC = () => {
  return (
    <div className="space-y-4 py-2">
      <div>
        <h3 className="text-sm font-medium">Staff Access Levels</h3>
        <ul className="mt-2 text-sm text-muted-foreground space-y-2">
          <li>
            <strong>Admin:</strong> Full access to all business features
          </li>
          <li>
            <strong>Co-Admin:</strong> Can manage staff and view analytics (limited to one per business)
          </li>
          <li>
            <strong>Staff:</strong> Standard access with job tracking capabilities
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-sm font-medium">Staff Invitations</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          When you send an invitation, staff members receive a link to create their own account.
          This allows them to login separately from your account.
        </p>
      </div>
    </div>
  );
};

export default InfoTab;
