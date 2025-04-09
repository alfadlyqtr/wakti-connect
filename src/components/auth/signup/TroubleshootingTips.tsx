
import React from "react";

interface TroubleshootingTipsProps {
  attemptCount: number;
}

const TroubleshootingTips: React.FC<TroubleshootingTipsProps> = ({ attemptCount }) => {
  if (attemptCount < 2) return null;
  
  return (
    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
      <p className="font-medium mb-2">Having trouble signing up?</p>
      <ul className="list-disc list-inside space-y-1">
        <li>Make sure your password is at least 6 characters long</li>
        <li>Try using a different email address</li>
        <li>Check your internet connection</li>
        <li>If problems persist, please contact support</li>
      </ul>
    </div>
  );
};

export default TroubleshootingTips;
