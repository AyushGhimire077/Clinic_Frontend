// response.ts
export type Severity = "success" | "error" | "info" | "warning";

export interface IResponse {
  status: number;
  severity: Severity;
  message: string;
  data?: any;
}

export const getSeverityColor = (severity: Severity): string => {
  const colors = {
    success: "text-success",
    error: "text-error",
    info: "text-info",
    warning: "text-warning",
  };
  return colors[severity];
};

 export interface PaginationInfo {
  page: number;
  size: number;
  total?: number;
  totalPages?: number;
}
