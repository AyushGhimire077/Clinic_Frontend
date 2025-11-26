export interface IResponse {
    message: string;
    status: number;
    severity:Severity;
}

type Severity = "success" | "error" | "info" | "warning";


export interface PaginationInfo {
  page: number;
  pageSize: number;
}