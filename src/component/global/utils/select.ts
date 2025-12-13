// select.ts
import {
  Gender,
  BillingMode,
  EpisodeType,
  Status,
  AppointmentStatus,
  DoctorType,
  StaffType,
  VisitStatus,
} from "./enums";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

// Makes "MALE" → "Male"
const toLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Converts any enum object → SelectOption[]
export const enumToOptions = <T extends object>(obj: T): SelectOption[] =>
  Object.values(obj).map((value) => ({
    label: toLabel(value),
    value,
  }));

export const genderOptions = enumToOptions(Gender);
export const billingModeOptions = enumToOptions(BillingMode);
export const episodeTypeOptions = enumToOptions(EpisodeType);
export const statusOptions = enumToOptions(Status);
export const doctorTypeOptions = enumToOptions(DoctorType);
export const staffTypeOptions = enumToOptions(StaffType);

export const visitStatusOptions = enumToOptions(VisitStatus);

export const appointmentStatusOptions = enumToOptions(AppointmentStatus);

export const getStatusColor = (status: Status | AppointmentStatus): string => {
  const colors: Record<string, string> = {
    ACTIVE: "text-success",
    CLOSED: "text-muted",
    BOOKED: "text-info",
    CHECKED_IN: "text-success",
    MISSED: "text-warning",
    CANCELLED: "text-error",
  };

  return colors[status] || "text-muted";
};
