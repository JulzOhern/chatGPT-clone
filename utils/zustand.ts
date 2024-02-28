import { create } from "zustand";

type UseOpenSideBarType = {
  isOpen: boolean;
  setCloseOpen: () => void;
  setCloseSidebar: (value: boolean) => void;
};

export const useOpenSideBar = create<UseOpenSideBarType>((set) => ({
  isOpen: false,
  setCloseOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setCloseSidebar: (value) => set(() => ({ isOpen: value })),
}));
