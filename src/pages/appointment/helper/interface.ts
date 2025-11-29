import type {
  AppointmentStatus,
  InvoiceType,
  IResponse,
  PaginationInfo,
} from "../../../component/global/interface";
import type { IPatientResponse } from "../../patient/componet/helper/interface";
import type { IStaff } from "../../staff/componet/staff/helper/interface";

export interface IAppointment {
  id: string;
  patient: IPatientResponse;
  doctor: IStaff;
  appointstatus: AppointmentStatus;
  services: string[];
  appointmentDate: string;
  invoiceType: InvoiceType;
}

export interface IAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDateTime: string;
  invoiceType: InvoiceType;
  services: string[];
  appointmentStatus: AppointmentStatus;
}

export interface AppointmentState {
  appointments: IAppointment[];

  create: (
    data: IAppointmentRequest
  ) => Promise<IResponse>;

  getAllAppointments: (pagination: PaginationInfo) => Promise<IResponse>;

  getByStatus: (stats: string, pagination: PaginationInfo) => Promise<IResponse>;
}
