import { format, toZonedTime } from "date-fns-tz";
import type { IResponse, Severity } from "../constant/global.interface";
import { BILLING_MODE_TAGS, STATUS_COLORS, TYPE_COLORS } from "../constant/tag";

export const getStatusColor = (status: string) =>
  STATUS_COLORS[status] ?? "bg-surface text-foreground border border-border";

export const getTypeColor = (type: string) =>
  TYPE_COLORS[type] ?? "bg-surface text-foreground border border-border";

export const getBillingModeTag = (mode: string) =>
  BILLING_MODE_TAGS[mode] ?? {
    label: "N/A",
    className: "bg-surface text-muted",
  };

// formatters / helpers
export const getTodayDateString = () => new Date().toISOString().split("T")[0];

const TIME_ZONE = "Asia/Kathmandu";

export const getLocalDateTime = (): string => {
  const now = new Date();
  const zonedDate = toZonedTime(now, TIME_ZONE);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm", { timeZone: TIME_ZONE });
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
  }).format(amount);

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// api response handlers
export const handleApiResponse = (res: any): IResponse => ({
  message: res.data?.message || "Request completed",
  status: res.data?.status || 500,
  severity: (res.data?.severity?.toLowerCase() as Severity) || "error",
  data: res.data?.data,
});

export const handleApiError = (error: any): IResponse => ({
  message: error?.response?.data?.message || error?.message || "Request failed",
  status: error?.response?.status || 500,
  severity: "error",
  data: undefined,
});
