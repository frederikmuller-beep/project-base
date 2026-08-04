import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://base-training-prototype.frederikmuller.chatgpt.site"),
  title: "BASE · Training prototype",
  description: "Klikbar prototype af BASE – plan, readiness, træningslog og feedback.",
  openGraph: {
    title: "BASE · Træn med formål",
    description: "Plan, readiness, træningslog og feedback i én fokuseret træningsoplevelse.",
    images: [{ url: "/og.png", width: 1707, height: 907, alt: "BASE – træn med formål" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BASE · Træn med formål",
    description: "Plan, readiness, træningslog og feedback i én fokuseret træningsoplevelse.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="da"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
