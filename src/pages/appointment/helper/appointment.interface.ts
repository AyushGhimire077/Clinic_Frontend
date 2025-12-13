import type {
  AppointmentStatus,
  IResponse,
  PaginationInfo,
  PaginationState,
} from "../../../component/global/utils/global.interface";
import type { IEpisode } from "../../episode/helper/episode.interface";

export interface IAppointment {
  id: string;
  episode: IEpisode;
  scheduledDateTime: string;
  status: AppointmentStatus;
}

export interface IAppointmentRequest {
  episodeId: string;
  patientId: string;
  doctorId: string;
  scheduledDateTime: string;
  status: AppointmentStatus;
}

export interface AppointmentState {
  appointments: IAppointment[];
  pagination: PaginationState | null;

  setPagination: (page: PaginationState | null) => void;
  setAppointment: (appointment: IAppointment[]) => void;

  create: (data: IAppointmentRequest) => Promise<IResponse>;

  update: (
    id: string,
    data: Partial<IAppointmentRequest>
  ) => Promise<IResponse>;
  getAllActive: (
    pagination: PaginationInfo,
    startDate: string,
    endDate: string
  ) => Promise<IResponse>;
  getAll: (
    pagination: PaginationInfo,
    startDate: string,
    endDate: string
  ) => Promise<IResponse>;
  getById: (id: string) => Promise<IResponse>;
  filterByStatus: (
    stats: string,
    pagination: PaginationInfo,
    startDate: string,
    endDate: string
  ) => void;
}
