
import React from "react";
import { StudentSetup } from "../StudentSetup";
import { ProfessionalSetup } from "../ProfessionalSetup";
import { BusinessSetup } from "../BusinessSetup";
import { TextCreatorSetup } from "../TextCreatorSetup";
import { useAISetup } from "../context/AISetupContext";

export const SpecializedSettingsStep: React.FC = () => {
  const { userRole, updateSpecializedSettings } = useAISetup();

  return (
    <>
      {userRole === "student" && (
        <StudentSetup onChange={updateSpecializedSettings} />
      )}
      {userRole === "professional" && (
        <ProfessionalSetup onChange={updateSpecializedSettings} />
      )}
      {userRole === "business_owner" && (
        <BusinessSetup onChange={updateSpecializedSettings} />
      )}
      {userRole === "other" && (
        <TextCreatorSetup onChange={updateSpecializedSettings} />
      )}
    </>
  );
};
