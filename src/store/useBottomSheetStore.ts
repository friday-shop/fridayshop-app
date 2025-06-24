import { type ReactNode } from 'react';
import { create } from 'zustand';

type BottomSheetState = {
  isOpen: boolean;
  content: ReactNode;
  open: (content: ReactNode) => void;
  close: () => void;
};

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isOpen: false,
  content: null,
  open: (content) => set({ isOpen: true, content }),
  close: () => set({ isOpen: false, content: null }),
}));
