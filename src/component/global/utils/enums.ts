// enums.ts
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
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

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

export const StaffType = {
  ALL_ROUNDER: "ALL_ROUNDER",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  FRONT_DESK: "FRONT_DESK",
  HELPER: "HELPER",
} as const;
export type StaffType = (typeof StaffType)[keyof typeof StaffType];

export const VisitStatus = {
  ONGOING: "ONGOING",
  PENDING: "PENDING",
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus];
