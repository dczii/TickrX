import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

import Header from "@/components/Header";
import "./globals.css";
import { TickerTape } from "@/components/TickrTape";

export const metadata = {
  title: "TickrX Tabs",
  description: "Crypto & US Stocks tabs with API routes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full'>
      <body className='min-h-full text-slate-100'>
        <div className='mx-auto max-w-[1440px]'>
          <Header />
          <TickerTape />
          <div className='px-4 py-10'>{children}</div>
        </div>
        <Toaster position='top-right' richColors />
        <Analytics />
      </body>
    </html>
  );
}
