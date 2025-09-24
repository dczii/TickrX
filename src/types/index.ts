export type DrawerContextType = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setTickr: (tickr: string | null) => void;
  tickr: string | null;
};
