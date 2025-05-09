
import React from "react";
import { Helmet } from "react-helmet-async";
import SimplePageBuilder from "@/components/business/page-builder/SimplePageBuilder";

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
