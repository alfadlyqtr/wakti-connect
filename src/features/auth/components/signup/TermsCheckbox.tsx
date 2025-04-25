
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TermsCheckbox: React.FC = () => {
  return (
    <div className="flex items-start gap-2 mt-2">
      <Checkbox id="terms" required className="mt-1" />
      <Label 
        htmlFor="terms" 
        className="text-sm font-normal cursor-pointer leading-tight"
      >
        I agree to the Terms of Service and Privacy Policy
      </Label>
    </div>
  );
};

export default TermsCheckbox;
