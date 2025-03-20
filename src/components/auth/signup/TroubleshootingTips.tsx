
import React from "react";

interface TroubleshootingTipsProps {
  attemptCount: number;
}

const TroubleshootingTips: React.FC<TroubleshootingTipsProps> = ({ attemptCount }) => {
  if (attemptCount < 2) return null;

  return (
    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
      <p>Having trouble creating an account? Try these steps:</p>
      <ul className="list-disc ml-5 mt-1">
        <li>Make sure you've entered a valid email address</li>
        <li>Use a strong password with at least 6 characters</li>
        <li>Try again in a few minutes</li>
        <li>Try using a different browser</li>
      </ul>
    </div>
  );
};

export default TroubleshootingTips;
