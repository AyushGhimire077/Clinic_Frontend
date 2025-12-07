import type { IResponse } from "../../../../component/global/interface";
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
  type: string;
  billingMode: string;
  status: string;
  primaryDoctorId: string;
  packageCharge: number;
}

export interface EpisodeState {
  episodeList: IEpisode[];
  setEpisodeList: (episodeList: IEpisode[]) => void;
  loading: boolean;
  createEpisode: (episode: EpisodeRequest) => Promise<IResponse>;
  getAllEpisodes: (patientId: string) => Promise<IResponse>;
}
