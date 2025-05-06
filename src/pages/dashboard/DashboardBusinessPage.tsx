
import React from "react";
import SimplePageBuilder from "@/components/business/page-builder/SimplePageBuilder";
import { Helmet } from "react-helmet-async";

const DashboardBusinessPage = () => {
  return (
    <>
      <Helmet>
        <title>Business Page Builder | WAKTI</title>
      </Helmet>
      <SimplePageBuilder />
    </>
  );
};

export default DashboardBusinessPage;
