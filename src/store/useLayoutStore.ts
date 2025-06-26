import { create } from 'zustand';

type LayoutState = {
  title: string;
  setTitle: (title: string) => void;
  search: string;
  setSearch: (search: string) => void;
  resetSearch: () => void;
  onCreate: () => void;
  triggerCreate: () => void;
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  title: '',
  setTitle: (title) => set({ title }),
  search: '',
  setSearch: (search) => set({ search }),
  resetSearch: () => set({ search: '' }),
  onCreate: () => {},
  triggerCreate: () => get().onCreate(),
}));
