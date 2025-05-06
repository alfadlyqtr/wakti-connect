
import React from "react";
import AIPageBuilder from "@/components/business/page-builder/AIPageBuilder";
import { Helmet } from "react-helmet-async";

const DashboardBusinessPage = () => {
  return (
    <>
      <Helmet>
        <title>Business Page Builder | WAKTI</title>
      </Helmet>
      <AIPageBuilder />
    </>
  );
};

export default DashboardBusinessPage;
