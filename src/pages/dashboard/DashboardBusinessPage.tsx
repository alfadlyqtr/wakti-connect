
import React from "react";
import BusinessPageBuilder from "@/components/business/page-builder/BusinessPageBuilder";
import { Helmet } from "react-helmet-async";

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
