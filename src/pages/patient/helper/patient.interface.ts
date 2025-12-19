import type {
  Gender,
  PaginationState,
} from "../../../component/constant/global.interface";
import type { IStaff } from "../../staff/staff.helper/staff.interface";

export interface IPatientRequest {
  name: string;
  email: string;
  contactNumber: number;
  address: string;
  gender: Gender;
  dob: string;
  oneTimeFlag?: boolean;
  bloodGroup: string;
}

export interface IPatient {
  id: string;
  name: string;
  email: string;
  contactNumber: number;
  bloodGroup: string;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  isActive: boolean;
  oneTimeFlag?: boolean;

  registeredBy: IStaff | null;
  createdAt: string;
  updatedAt: string;
}
export interface IPatientCount {
  total: number;
  active: number;
  oneTime: number;
}

export interface PatientState {
  isLoading: boolean;
  list: IPatient[];

  pagination: PaginationState;
  count: IPatientCount | null;

  setPage: (page: number) => void;

  // commands
  create: (staff: IPatientRequest) => Promise<void>;
  update: (id: string, staff: IPatientRequest) => Promise<void>;
  enable: (id: string) => Promise<void>;
  disable: (id: string) => Promise<void>;
  //query
  fetchById: (id: string) => Promise<IPatient>;
  fetchAll: () => Promise<void>;
  fetchActive: () => Promise<void>;
  search: (name: string) => Promise<void>;
  fetchCount: () => Promise<void>;
}
