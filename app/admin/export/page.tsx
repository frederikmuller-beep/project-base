import type { Metadata } from "next";
import { ExportPanel } from "./export-panel";

export const metadata: Metadata = {
  title: "Testdata · BASE",
  robots: { index: false, follow: false },
};

export default function ExportPage() {
  return <ExportPanel />;
}
