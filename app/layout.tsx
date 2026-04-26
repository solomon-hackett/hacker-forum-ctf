import type { Metadata } from "next";
import "./globals.css";

import { JetBrains_Mono } from "next/font/google";

import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/navbar";
import { Analytics } from "@vercel/analytics/next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "GhostNet",
    template: " %s | GhostNet",
  },
  description: "Dark web hacker forum for master black hat hackers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <Analytics />
      <body
        className={`flex flex-col bg-base text-content-primary min-h-full ${jetbrainsMono.className}`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
