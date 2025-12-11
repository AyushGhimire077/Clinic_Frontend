import type {
  AppointmentStatus,
  IResponse,
  PaginationInfo,
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

  create: (data: IAppointmentRequest) => Promise<IResponse>;

  getAllAppointments: (pagination: PaginationInfo) => Promise<IResponse>;

  getAppointmentById: (id: string) => Promise<IResponse>;

  getByStatus: (
    stats: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;

  update: (
    id: string,
    data: Partial<IAppointmentRequest>
  ) => Promise<IResponse>;
}
