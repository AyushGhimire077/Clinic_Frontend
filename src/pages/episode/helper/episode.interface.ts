import type {
  BillingMode,
  EpisodeType,
  Status,
} from "../../../component/constant/enums";
import type {
  IResponse,
  PaginationState,
} from "../../../component/constant/global.interface";
import type { PaginationInfo } from "../../../component/constant/response";
import type { IPatient } from "../../patient/helper/patient.interface";
import type { IStaff } from "../../staff/staff.helper/staff.interface";

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
  startDate?: string | null;
  endDate?: string | null;
  count: Record<string, number> | null;

  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setPagination: (page: PaginationState | null) => void;
  setEpisodeList: (episodeList: IEpisode[]) => void;
  setEpisodeTemplateList: (episodeTemplateList: IEpisodeTemp[]) => void;

  createEpisode: (data: EpisodeRequest) => Promise<IResponse>;
  getAllEpisodes: (
    pagination: PaginationInfo,
    startDate?: string,
    endDate?: string
  ) => Promise<IResponse>;
  filterByStatus: (
    stats: string,
    pagination: PaginationInfo,
    startDate?: string,
    endDate?: string
  ) => Promise<IResponse>;
  getEpisodeById: (id: string) => Promise<IResponse>;
  cancelEpisode: (id: string) => Promise<IResponse>;
  countEpisodes: () => Promise<IResponse>;
  searchEpisodes: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;

  createEpisodeTemplate: (data: EpisodeTempReq) => Promise<IResponse>;
  getAllEpisodeTemplates: (
    pagination: PaginationInfo,
    startDate?: string,
    endDate?: string
  ) => Promise<IResponse>;
  getEpisodeTemplateById: (id: string) => Promise<IResponse>;
}
