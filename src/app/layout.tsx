import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata = {
  title: "TickrX Tabs",
  description: "Crypto & US Stocks tabs with API routes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full'>
      <body className='min-h-full text-slate-100'>
        {children}
        <Toaster position='top-right' richColors />
      </body>
    </html>
  );
}
