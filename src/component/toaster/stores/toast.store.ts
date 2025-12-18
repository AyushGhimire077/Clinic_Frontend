import { create } from "zustand";
import type { ToastData, ToastSeverity } from "../types/toast";

interface ToastState {
  toast: ToastData;
  showToast: (message: string, severity?: ToastSeverity) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: { message: "", severity: "info", open: false },

  showToast: (message, severity = "info") => {
    set({ toast: { message, severity, open: true } });

    setTimeout(() => {
      set((state) => ({
        toast: { ...state.toast, open: false },
      }));
    }, 4000);
  },

  closeToast: () => {
    set((state) => ({
      toast: { ...state.toast, open: false },
    }));
  },
}));
