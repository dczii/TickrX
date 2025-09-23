"use client";

import { useState, createContext, ReactNode, useContext, useEffect } from "react";
import type { DrawerContextType } from "@/types";
import { Drawer } from "vaul";

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("useDrawer must be used within DrawerProvider");
  return context;
}

export default function VaulDrawer() {
  const { isOpen, closeDrawer } = useDrawer();

  useEffect(() => {
    async function loadStockData() {
      const r = await fetch("/api/stock-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: "AAPL", companyName: "Apple Inc." }),
      });
      const data = await r.json();
    }

    loadStockData();
  }, []);

  return (
    <Drawer.Root open={isOpen} onOpenChange={closeDrawer}>
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 bg-black/40' />
        <Drawer.Content className='bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none text-black'>
          <Drawer.Title />
          <div className='p-4 bg-white rounded-t h-[50vh]'>asdfasdfsadfa</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
