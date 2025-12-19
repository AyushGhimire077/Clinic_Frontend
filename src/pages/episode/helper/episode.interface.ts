import type {
  BillingMode,
  EpisodeType,
  Status,
} from "../../../component/constant/enums";
import type {
  DateRange,
  PaginationInfo,
  PaginationState,
} from "../../../component/constant/global.interface";

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

export interface IEpisodeRequest {
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

export interface EpisodeCount {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
}

export interface EpisodeState {
  list: IEpisode[];
  isLoading: boolean;
  pagination: PaginationState;
  range: DateRange;
  count: EpisodeCount;

  setPage: (page: number) => void;

  // commands
  create: (data: IEpisodeRequest) => Promise<void>;
  changeStatus: (id: string, status: string) => Promise<void>;
  changeType: (id: string, type: string) => Promise<void>;
  changeBillingMode: (id: string, billingMode: string) => Promise<void>;
  remove: (id: string) => Promise<void>;

  // queries
  fetchAll: () => Promise<void>;
  fetchActive: () => Promise<void>;
  fetchByStatus: (status: string) => Promise<void>;
  fetchByRange: (range?: DateRange) => Promise<void>;
  fetchByStatusRange: (status: string, range?: DateRange) => Promise<void>;

  // counts
  countAll: () => Promise<void>;
  countByRange: (range?: DateRange) => Promise<void>;
  
}












// -------------------------------------------------
// Template Interfaces

export interface IEpisodeTempReq {
  title: string;
  type: EpisodeType;
  billingMode: BillingMode;
  packageCharge: number;
}

export interface IEpisodeTemp {
  data: IEpisodeTemp | PromiseLike<IEpisodeTemp>;
  id: string;
  title: string;
  type: EpisodeType;
  billingMode: BillingMode;
  packageCharge: number;
  createdAt: string;
}

export interface EpisodeTempState {
  list: IEpisodeTemp[];
  isLoading: boolean;

  pagination: PaginationState;

  setPage: (page: number) => void;

  // command
  create: (data: IEpisodeTempReq) => Promise<void>;
  update: (id: string, data: IEpisodeTempReq) => Promise<void>;
  remove: (id: string) => Promise<void>;
  enable: (id: string) => Promise<void>;
  disable: (id: string) => Promise<void>;

  // query
  fetchAll: (pagination?: PaginationInfo) => Promise<void>;
  fetchActive: () => Promise<void>;
  fetchById: (id: string) => Promise<IEpisodeTemp>;
  searchByName: (name: string) => Promise<void>;
}
