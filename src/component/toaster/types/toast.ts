export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastData {
  message: string;
  severity: ToastSeverity;
  open: boolean;
}