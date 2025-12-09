// Core Response Interface
export interface IResponse {
  status: number;
  severity: Severity;
  message: string;
 }
export type Severity = "success" | "error" | "info" | "warning";

// Pagination
export interface PaginationInfo {
  page: number;
  size: number;
  total?: number;
  totalPages?: number;
}

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const BillingMode = {
  PER_VISIT: "PER_VISIT",
  PACKAGE: "PACKAGE",
} as const;
export type BillingMode = (typeof BillingMode)[keyof typeof BillingMode];

export const EpisodeType = {
  ONE_TIME: "ONE_TIME",
  RECURRING: "RECURRING",
} as const;
export type EpisodeType = (typeof EpisodeType)[keyof typeof EpisodeType];

export const Status = {
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const AppointmentStatus = {
  BOOKED: "BOOKED",
  CHECKED_IN: "CHECKED_IN",
  MISSED: "MISSED",
  CANCELLED: "CANCELLED",
} as const;
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

// Doctor Types
export const DoctorType = {
  GENERAL: "GENERAL",
  GYNECOLOGIST: "GYNECOLOGIST",
  DERMATOLOGIST: "DERMATOLOGIST",
  PEDIATRIC: "PEDIATRIC",
  CARDIOLOGIST: "CARDIOLOGIST",
  NEUROLOGIST: "NEUROLOGIST",
  ORTHOPEDIC: "ORTHOPEDIC",
  ENT: "ENT",
  DENTIST: "DENTIST",
  PSYCHIATRIST: "PSYCHIATRIST",
  SURGEON: "SURGEON",
  RADIOLOGIST: "RADIOLOGIST",
  PATHOLOGIST: "PATHOLOGIST",
  PHYSIOTHERAPIST: "PHYSIOTHERAPIST",
  NURSE: "NURSE",
  LAB_TECHNICIAN: "LAB_TECHNICIAN",
} as const;

export type DoctorType = (typeof DoctorType)[keyof typeof DoctorType];

// Staff Types
export const StaffType = {
  ALL_ROUNDER: "ALL_ROUNDER",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  FRONT_DESK: "FRONT_DESK",
  HELPER: "HELPER",
} as const;

export type StaffType = (typeof StaffType)[keyof typeof StaffType];

// Select Options Utilities
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export const appointmentStatusOptions: SelectOption<AppointmentStatus>[] = [
  { label: "Booked", value: AppointmentStatus.BOOKED },
  { label: "Checked In", value: AppointmentStatus.CHECKED_IN },
  { label: "Missed", value: AppointmentStatus.MISSED },
  { label: "Cancelled", value: AppointmentStatus.CANCELLED },
];

export const episodeTypeOptions: SelectOption<EpisodeType>[] = [
  { label: "One Time", value: EpisodeType.ONE_TIME },
  { label: "Recurring", value: EpisodeType.RECURRING },
];

export const genderOptions: SelectOption<Gender>[] = [
  { label: "Male", value: Gender.MALE },
  { label: "Female", value: Gender.FEMALE },
  { label: "Other", value: Gender.OTHER },
];

export const billingModeOptions: SelectOption<BillingMode>[] = [
  { label: "Per Visit", value: BillingMode.PER_VISIT },
  { label: "Package", value: BillingMode.PACKAGE },
];

export const statusOptions: SelectOption<Status>[] = [
  { label: "Active", value: Status.ACTIVE },
  { label: "Closed", value: Status.CLOSED },
];

export const doctorTypeOptions: SelectOption<DoctorType>[] = Object.values(
  DoctorType
).map((value) => ({
  label: value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()),
  value,
}));

export const staffTypeOptions: SelectOption<StaffType>[] = Object.values(
  StaffType
).map((value) => ({
  label: value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()),
  value,
}));

// Utility Functions
export const getSeverityColor = (severity: Severity): string => {
  const colors = {
    success: "text-success",
    error: "text-error",
    info: "text-info",
    warning: "text-warning",
  };
  return colors[severity];
};

export const getStatusColor = (status: Status | AppointmentStatus): string => {
  const colors: Record<string, string> = {
    [Status.ACTIVE]: "text-success",
    [Status.CLOSED]: "text-muted",
    [AppointmentStatus.BOOKED]: "text-info",
    [AppointmentStatus.CHECKED_IN]: "text-success",
    [AppointmentStatus.MISSED]: "text-warning",
    [AppointmentStatus.CANCELLED]: "text-error",
  };
  return colors[status] || "text-muted";
};
