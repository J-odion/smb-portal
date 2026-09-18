import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SyncProvider } from "../components/SyncProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "African SMB Portal",
  description: "Business management platform for SMBs",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SyncProvider>
          {children}
        </SyncProvider>
      </body>
    </html>
  );
}
