export interface IResponse {
    message: string;
    status: number;
    severity:Severity;
}

type Severity = "success" | "error" | "info" | "warning";


export interface PaginationInfo {
  page: number;
  size: number;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";