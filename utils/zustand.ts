import { create } from "zustand";

type UseOpenSideBarType = {
  isOpen: boolean;
  setOpenSidebar: () => void;
  setCloseSidebar: () => void;
};

export const useOpenSideBar = create<UseOpenSideBarType>((set) => ({
  isOpen: false,
  setOpenSidebar: () => set((state) => ({ isOpen: true })),
  setCloseSidebar: () => set(() => ({ isOpen: false })),
}));
