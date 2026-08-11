import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard — 7stories",
  description:
    "Your storytelling studio. Create and manage brand, company, and family stories built on the seven basic plots.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
