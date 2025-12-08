import type {
  BillingMode,
  EpisodeType,
  IResponse,
  PaginationInfo,
  Status,
} from "../../../../component/global/interface";
import type { IPatient } from "../../../patient/componet/helper/interface";
import type { IStaff } from "../../../staff/componet/staff/helper/interface";

export interface IEpisode {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  // ONE_TIME, PACKAGE
  type: EpisodeType;

  billingMode: BillingMode; // PER_VISIT, PACKAGE

  status: Status;
  primaryDoctor: IStaff;
  patient: IPatient;

  packageCharge: number;
}

export interface EpisodeRequest {
  title: string;
  startDate: string;
  endDate: string;
  type: EpisodeType;
  billingMode: BillingMode;
  status: Status;
  primaryDoctorId: string;
  patientId: string;
  templateId?: string;
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
  setEpisodeTemplateList: (episodeTemplateList: IEpisodeTemp[]) => void;
  setEpisodeList: (episodeList: IEpisode[]) => void;
  loading: boolean;
  createEpisode: (episode: EpisodeRequest) => Promise<IResponse>;
  createEpisodeTemplate: (episode: EpisodeTempReq) => Promise<IResponse>;
  getAllEpisodeTemplates: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllEpisodes: (pagination: PaginationInfo) => Promise<IResponse>;

  getEpisodeById: (id: string) => Promise<IResponse>;
  getEpisodeTemplateById: (id: string) => Promise<IResponse>;
}
