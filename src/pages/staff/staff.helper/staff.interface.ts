import type { DoctorType, StaffType } from "../../../component/constant/enums";
import type { PaginationInfo, PaginationState } from "../../../component/constant/global.interface";
 
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

export interface StaffCount {
  total: number;
  active: number;
}

export interface StaffState {
  isLoading: boolean;
  list: IStaff[];
  
 
  pagination: PaginationState;
  count: StaffCount | null;

  setPage: (page: number) => void;

  // commands
  create: (staff: IStaffRequest) => Promise<void>;
  update: (id: string, staff: IStaffRequest) => Promise<void>;
  enable: (id: string) => Promise<void>;
  disable: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  //query
  fetchById: (id: string) => Promise<IStaff  >;
  fetchAll: () => Promise<void>;
  fetchActive: () => Promise<void>;
  search: (name: string) => Promise<void>;
  fetchCount: () => Promise<void>;
}
