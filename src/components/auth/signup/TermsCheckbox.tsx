
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TermsCheckbox: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" required />
      <Label 
        htmlFor="terms" 
        className="text-sm font-normal cursor-pointer"
      >
        I agree to the Terms of Service and Privacy Policy
      </Label>
    </div>
  );
};

export default TermsCheckbox;
