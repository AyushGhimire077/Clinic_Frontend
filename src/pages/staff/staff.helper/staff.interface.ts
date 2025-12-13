import type {
  DoctorType,
  IResponse,
  PaginationInfo,
  PaginationState,
  StaffType,
} from "../../../component/global/utils/global.interface";

export interface IStaffRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: number;
  salary: number;
  type: StaffType | "";
  roleId: string;
  doctorSubType?: DoctorType | "" | null;
}

export interface IStaff {
  id: string;
  name: string;
  email: string;
  contactNumber: number;
  salary: number;
  role: string;
  type: StaffType | "";
  isActive: boolean;
  doctorSubType: DoctorType | "";
}

export interface StaffState {
  staffList: IStaff[];
  pagination: PaginationState | null;
  count: Record<string , number> | null;

  setStaffList: (staffList: IStaff[]) => void;
  setPagination: (page: PaginationState | null) => void;

  createStaff: (staff: IStaffRequest) => Promise<IResponse>;
  getAllStaff: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActiveStaff: (pagination: PaginationInfo) => Promise<IResponse>;
  countStaff: () => Promise<IResponse>;
  searchStaff: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;
}
