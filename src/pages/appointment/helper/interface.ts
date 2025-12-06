import type {
  AppointmentStatus,
  InvoiceType,
  IResponse,
  PaginationInfo,
} from "../../../component/global/interface";
import type { IPatient } from "../../patient/componet/helper/interface";
 import type { IServices } from "../../services/helper/interface";
import type { IStaff } from "../../staff/componet/staff/helper/interface";

export interface IAppointment {
  id: string;
  patient: IPatient;
  doctor: IStaff;
  status: AppointmentStatus;
  services: IServices[];
  dateTime: string;
  invoiceType: InvoiceType;
}

export interface IAppointmentRequest {
  patientId: string;
  doctorId: string;
  dateTime: string;
  invoiceType: InvoiceType;
  services: String[];
  status: AppointmentStatus;
}

export interface AppointmentState {
  appointments: IAppointment[];

  create: (data: IAppointmentRequest) => Promise<IResponse>;

  getAllAppointments: (pagination: PaginationInfo) => Promise<IResponse>;

  getByStatus: (
    stats: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;

  update: (id: string, data: Partial<IAppointmentRequest>) => Promise<IResponse>;
}
