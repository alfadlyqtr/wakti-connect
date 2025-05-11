
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

interface PublicLayoutProps {
  children?: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
