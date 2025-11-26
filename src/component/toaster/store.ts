import { create } from "zustand";
import type { IToasterData, ToasterState } from "./interface";

export const useGlobalStore = create<ToasterState>((set) => ({
  toasterData: {
    open: true,
    message: "",
    severity: undefined,
  },
  setToasterData: (data: IToasterData) => {
    set(() => ({
      toasterData: { ...data },
    }));
  },
  closeToaster: () => {
    set(() => ({
      toasterData: {
        open: false,
        message: "",
        severity: undefined,
      },
    }));
  },
}));
 