import { create } from "zustand";
import type { ToastData, ToastSeverity } from "../types/toast";
 
interface ToastState {
  toast: ToastData;
  showToast: (message: string, severity: string) => void;
  closeToast: () => void;
}

// Normalize any case severity to lowercase for consistency
const normalizeSeverity = (severity: string): ToastSeverity => {
  const severityMap: Record<string, ToastSeverity> = {
    success: "success",
    error: "error",
    info: "info",
    warning: "warning",
  };
  
  const lowerSeverity = severity.toLowerCase();
  return severityMap[lowerSeverity] || "info";
};

export const useToastStore = create<ToastState>((set) => ({
  toast: { message: "", severity: "info", open: false },
  
  showToast: (message: string, severity: string) => {
    const normalizedSeverity = normalizeSeverity(severity);
    set({ toast: { message, severity: normalizedSeverity, open: true } });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, open: false } }));
    }, 5000);
  },
  
  closeToast: () => {
    set((state) => ({ toast: { ...state.toast, open: false } }));
  },
}));