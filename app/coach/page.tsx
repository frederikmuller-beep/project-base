import type { Metadata } from "next";
import { CoachDashboard } from "./coach-dashboard";

export const metadata: Metadata = {
  title: "Træneroverblik · BASE",
  robots: { index: false, follow: false },
};

export default function CoachPage() {
  return <CoachDashboard />;
}
