import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
// src/app/layout.tsx
import '@/styles/sweetAlert.css';
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "600"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${fraunces.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}