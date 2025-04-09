
import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

const NoPermissionMessage: React.FC = () => {
  return (
    <div className="p-4 border-t bg-amber-50">
      <div className="flex items-start gap-3 text-amber-800">
        <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">You cannot message this user</p>
          <p className="text-sm text-amber-700">
            Free account users can only message contacts. Business accounts can message anyone.
          </p>
          <div className="mt-2 bg-white p-2 rounded-md border border-amber-200 flex items-start gap-2">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
            <p className="text-xs text-amber-700">
              To message this user, either upgrade your account or add them as a contact first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPermissionMessage;
