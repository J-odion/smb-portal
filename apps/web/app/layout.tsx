import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SyncProvider } from "../components/SyncProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "African SMB Portal",
  description: "Business management platform for SMBs",
  manifest: "/manifest.json",
  themeColor: "#a855f7"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SyncProvider>
          {children}
        </SyncProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) { console.log('SW registered: ', registration.scope); },
                    function(err) { console.log('SW registration failed: ', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
