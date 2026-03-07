import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D&D NPC Voice — Mira Ashvane",
  description: "Talk to Mira Ashvane at The Brine & Barrel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-[#0a0a0c]">{children}</body>
    </html>
  );
}
