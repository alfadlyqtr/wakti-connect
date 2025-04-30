
import React from "react";
import { SimpleInvitationCreator } from "@/components/invitations/SimpleInvitationCreator";

export const CreateInvitationPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create Invitation</h1>
      <SimpleInvitationCreator />
    </div>
  );
};

export default CreateInvitationPage;
