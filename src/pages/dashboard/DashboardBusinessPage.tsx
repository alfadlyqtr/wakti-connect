
import React from "react";
import { Helmet } from "react-helmet-async";
import BusinessPageBuilder from "@/components/business/page-builder/BusinessPageBuilder";

const DashboardBusinessPage = () => {
  return (
    <>
      <Helmet>
        <title>Business Page Builder | WAKTI</title>
      </Helmet>
      <BusinessPageBuilder />
    </>
  );
};

export default DashboardBusinessPage;
