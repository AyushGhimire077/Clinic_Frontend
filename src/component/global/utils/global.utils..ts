import type { IResponse, Severity } from "./global.interface";

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

// Utility functions
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
