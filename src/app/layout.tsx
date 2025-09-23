import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Drawer from "@/components/Drawer";

import Header from "@/components/Header";
import { DrawerProvider } from "@/components/Drawer";
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
        <DrawerProvider>
          <Drawer />
          <div className='mx-auto max-w-[1440px]'>
            <Header />
            <TickerTape />
            {children}
          </div>
        </DrawerProvider>
        <Toaster position='top-right' richColors />
        <Analytics />
      </body>
    </html>
  );
}
