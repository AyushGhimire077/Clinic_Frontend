import type {
  BillingMode,
  EpisodeType,
  IResponse,
  PaginationInfo,
} from "../../../../component/global/interface";
import type { IStaff } from "../../../staff/componet/staff/helper/interface";

export interface IEpisode {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  // ONE_TIME, PACKAGE
  type: string;
  // PER_VISIT, PACKAGE
  billingMode: string;
  // open / closed
  status: string;
  primaryDoctor: IStaff;
  packageCharge: number;
}

export interface EpisodeRequest {
  title: string;
  startDate: string;
  endDate: string;
  type: EpisodeType;
  billingMode: string;
  status: string;
  primaryDoctorId: string;
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
