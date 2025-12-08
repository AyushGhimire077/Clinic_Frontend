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

export type BillingMode = "PER_VISIT" | "PACKAGE";

export type EpisodeType = "ONE_TIME" | "RECURRING";

export type Status = "ACTIVE" | "CLOSED" ;

export type AppointmentStatus =
  | "BOOKED"
  | "CHECKED_IN"
  | "MISSED"
  | "CANCELLED";

  export const appointmentStatusOptions = [
    { label: "BOOKED", value: "BOOKED" },
    { label: "CHECKED_IN", value: "CHECKED_IN" },
    { label: "MISSED", value: "MISSED" }, 
    { label: "CANCELLED", value: "CANCELLED" },
  ];

  export const episodeTypeOptions = [
    { label: "ONE_TIME", value: "ONE_TIME" },
    { label: "RECURRING", value: "RECURRING" },
  ];

export const DoctorTypeOption = {
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

export type DoctorType =
  (typeof DoctorTypeOption)[keyof typeof DoctorTypeOption];

export const doctorTypeOptions = Object.values(DoctorTypeOption).map(
  (value) => ({
    label: value,
    value,
  })
);

export const StaffTypeOption = {
  ALL_ROUNDER: "ALL_ROUNDER",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  FRONT_DESK: "FRONT_DESK",
  HELPER: "HELPER",
} as const;

export type StaffType = (typeof StaffTypeOption)[keyof typeof StaffTypeOption];

export const staffTypeOptions = Object.values(StaffTypeOption).map((value) => ({
  label: value,
  value,
}));
