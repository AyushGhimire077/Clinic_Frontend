export interface IResponse {
  message: string;
  status: number;
  severity: Severity;
}

type Severity = "success" | "error" | "info" | "warning";

export interface PaginationInfo {
  page: number;
  size: number;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type InvoiceType = "ONE_TIME" | "CONTINUOUS";

export type AppointmentStatus = "OPEN" | "PAID" | "CANCELLED";

export type StaffType =
  | "GENERAL"
  | "GYNECOLOGIST"
  | "DERMATOLOGIST"
  | "PEDIATRIC"
  | "CARDIOLOGIST"
  | "NEUROLOGIST"
  | "ORTHOPEDIC"
  | "ENT"
  | "DENTIST"
  | "PSYCHIATRIST"
  | "SURGEON"
  | "RADIOLOGIST"
  | "PATHOLOGIST"
  | "PHYSIOTHERAPIST"
  | "NURSE"
  | "LAB_TECHNICIAN";

export const Stafftype: StaffType[] = [
  "GENERAL",
  "GYNECOLOGIST",
  "DERMATOLOGIST",
  "PEDIATRIC",
  "CARDIOLOGIST",
  "NEUROLOGIST",
  "ORTHOPEDIC",
  "ENT",
  "DENTIST",
  "PSYCHIATRIST",

  "SURGEON",
  "RADIOLOGIST",
  "PATHOLOGIST",
  "PHYSIOTHERAPIST",
  "NURSE",
  "LAB_TECHNICIAN",
];
