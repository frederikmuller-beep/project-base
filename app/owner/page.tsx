import type { Metadata } from "next";
import { OwnerDashboard } from "./owner-dashboard";

export const metadata: Metadata = {
  title: "Ejer-dashboard · BASE",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return <OwnerDashboard />;
}
