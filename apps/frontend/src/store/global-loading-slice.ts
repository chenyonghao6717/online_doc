import { type StateCreator } from "zustand";

export interface GlobalLoadingSlice {
  loadingCount: number;
  startLoading: () => void;
  stopLoading: () => void;
}

export const createGlobalLoadingSlice: StateCreator<
  GlobalLoadingSlice,
  [],
  [],
  GlobalLoadingSlice
> = (set) => ({
  loadingCount: 0,
  startLoading: () =>
    set((state) => ({ loadingCount: state.loadingCount + 1 })),
  stopLoading: () => set((state) => ({ loadingCount: state.loadingCount - 1 })),
});
