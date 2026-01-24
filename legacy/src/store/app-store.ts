import {
  createGlobalLoadingSlice,
  GlobalLoadingSlice,
} from "@/store/global-loading-slice";
import { create } from "zustand";

type AppStore = GlobalLoadingSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createGlobalLoadingSlice(...a),
}));
