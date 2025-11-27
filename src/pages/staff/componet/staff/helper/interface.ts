import type {
  IResponse,
  PaginationInfo,
} from "../../../../../component/global/interface";

export interface StaffState {
  staffList: IStaff[];
  setStaffList: (staffList: IStaff[]) => void;

  createStaff: (staff: IStaffRequest) => Promise<IResponse>;
  getAllStaff: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActiveStaff: (pagination: PaginationInfo) => Promise<IResponse>;
  searchStaff: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;
}

export interface IStaffRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: number;
  salary: number;
  role: string;
}

export interface IStaff {
  id: string;
  name: string;
  email: string;
  contactNumber: number;
  salary: number;
  role: string;
  isActive: boolean;
}
