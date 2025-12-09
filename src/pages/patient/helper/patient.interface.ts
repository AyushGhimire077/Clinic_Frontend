import type {
  Gender,
  IResponse,
  PaginationInfo,
} from "../../../component/global/interface";
import type { IStaff } from "../../staff/staff.helper/staff.interface";

export interface IPatientRequest {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  gender: Gender;
  dob: string;
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
  staffRegisteredBy: IStaff;
  adminRegisteredBy: IStaff;
  createdAt: string;
  updatedAt: string;
}

export interface PatientState {
  patientList: IPatient[];
  currentPage: number;
  totalPages: number;
  totalItems: number;

  setPatientList: (patientList: IPatient[]) => void;
  createPatient: (patient: IPatientRequest) => Promise<IResponse>;
  editPatient: (id: string, patient: Partial<IPatientRequest>) => Promise<IResponse>;
  getAllPatients: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActivePatients: (pagination: PaginationInfo) => Promise<IResponse>;
  searchPatients: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;
  getPatientById: (id: string) => Promise<IPatient | null>;
}
