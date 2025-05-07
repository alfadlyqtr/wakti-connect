
import React from "react";
import { Helmet } from "react-helmet-async";
import SimpleBusinessPageBuilder from "@/components/business/page-builder/SimpleBusinessPageBuilder";

const DashboardBusinessPage = () => {
  return (
    <>
      <Helmet>
        <title>Business Page Builder | WAKTI</title>
      </Helmet>
      <SimpleBusinessPageBuilder />
    </>
  );
};

export default DashboardBusinessPage;
