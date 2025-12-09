import type {
  EpisodeType,
  BillingMode,
  Status,
  IResponse,
  PaginationInfo,
} from "../../../component/global/interface";
import type { IPatient } from "../../patient/helper/patient.interface";
import type { IStaff } from "../../staff/staff.helper/staff.interface";

export interface IEpisode {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: EpisodeType;
  billingMode: BillingMode;
  status: Status;
  primaryDoctor: IStaff;
  patient: IPatient;
  packageCharge: number;
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
}

export interface EpisodeState {
  episodeList: IEpisode[];
  episodeTemplateList: IEpisodeTemp[];
  currentPage: number;
  totalPages: number;
  totalItems: number;

  setEpisodeTemplateList: (episodeTemplateList: IEpisodeTemp[]) => void;
  setEpisodeList: (episodeList: IEpisode[]) => void;

  createEpisode: (episode: EpisodeRequest) => Promise<IResponse>;
  createEpisodeTemplate: (episode: EpisodeTempReq) => Promise<IResponse>;
  getAllEpisodeTemplates: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllEpisodes: (pagination: PaginationInfo) => Promise<IResponse>;
  getEpisodeById: (id: string) => Promise<IResponse>;
  getEpisodeTemplateById: (id: string) => Promise<IResponse>;
}
