import type { ReactNode } from 'react';
import { create } from 'zustand';

type LayoutState = {
  title: string;
  setTitle: (title: string) => void;
  search: string;
  setSearch: (search: string) => void;
  resetSearch: () => void;
  content?: ReactNode;
  setContent: (content: ReactNode) => void;
  resetContent?: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  title: '',
  setTitle: (title) => set({ title }),
  search: '',
  setSearch: (search) => set({ search }),
  resetSearch: () => set({ search: '' }),
  content: null,
  setContent: (content) => set({ content }),
  resetContent: () => set({ content: null }),
}));
