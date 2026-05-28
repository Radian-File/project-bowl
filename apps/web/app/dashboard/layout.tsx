import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "ProjectBowl Dashboard · ricky.dev",
  description: "Admin dashboard for managing projects, AI content, tasks, milestones, and portfolio publishing.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
