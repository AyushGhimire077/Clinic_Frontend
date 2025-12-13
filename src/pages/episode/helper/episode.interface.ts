import type {
  BillingMode,
  EpisodeType,
  Status,
} from "../../../component/global/utils/enums";
import type { IPatient } from "../../patient/helper/patient.interface";
import type { IStaff } from "../../staff/staff.helper/staff.interface";
import type { PaginationInfo } from "../../../component/global/utils/response";
import type { IResponse, PaginationState } from "../../../component/global/utils/global.interface";

export interface IEpisode {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  type: EpisodeType;
  billingMode: BillingMode;
  status: Status;
  primaryDoctor: IStaff;
  patient: IPatient;
  packageCharge: number;
  appointment: boolean;
  createdAt: string;
}

export interface EpisodeRequest {
  title: string;
  startDate: string;
  endDate?: string;
  type: EpisodeType;
  billingMode: BillingMode;
  status: Status;
  primaryDoctorId: string;
  patientId: string;
  packageCharge: number;
  appointment: boolean;
}

export interface EpisodeTempReq {
  title: string;
  type: EpisodeType;
  billingMode: BillingMode;
  packageCharge: number;
}

export interface IEpisodeTemp {
  id: string;
  title: string;
  type: EpisodeType;
  billingMode: BillingMode;
  packageCharge: number;
  createdAt: string;
}

export interface EpisodeState {
  episodeList: IEpisode[];
  episodeTemplateList: IEpisodeTemp[];
  pagination: PaginationState | null;

  createEpisode: (data: EpisodeRequest) => Promise<IResponse>;
  getAllEpisodes: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActiveEpisodes: (pagination: PaginationInfo) => Promise<IResponse>;
  filterByStatus: (stats: string, pagination: PaginationInfo) => Promise<IResponse>;
  getEpisodeById: (id: string) => Promise<IResponse>;
  cancelEpisode: (id: string) => Promise<IResponse>;

  createEpisodeTemplate: (data: EpisodeTempReq) => Promise<IResponse>;
  getAllEpisodeTemplates: (pagination: PaginationInfo) => Promise<IResponse>;
  getEpisodeTemplateById: (id: string) => Promise<IResponse>;
}
