import type { Gender, IResponse, PaginationInfo } from "../../../../component/global/interface";
import type {
  IStaff,
} from "../../../staff/componet/staff/helper/interface";

export interface IPatientRequest {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  gender: Gender;
  dob: string;
  bloodGroup: string;
}

export interface IPatientResponse {
  id: string;
  name: string;
  email: string;
  contactNumber: number;
  bloodGroup: string;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  isActive: boolean;
  oneTimeFlag: boolean;

  staffRegisteredBy: IStaff;
  adminRegisteredBy: IStaff;
  createdAt: string;
  updatedAt: string;
}

export interface PatientState {
  patientList: IPatientResponse[];
  setPatientList: (patientList: IPatientResponse[]) => void;

  createPatient: (patient: IPatientRequest) => Promise<IResponse>;
  getAllPatients: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActivePatients: (pagination: PaginationInfo) => Promise<IResponse>;
  searchPatients: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;
}