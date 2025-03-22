
import React from "react";

export interface SidebarNavItem {
  title: string;
  href: string;
  accountType: string;
  icon?: React.ReactNode;
}

export type TaskStatus = "completed" | "in-progress" | "pending" | "late";
