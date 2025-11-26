import type { IResponse, PaginationInfo } from "../../../../global/interface";

export interface StaffState {
  staffList: Staff[];
  setStaffList: (staffList: Staff[]) => void;

  createStaff: (staff: StaffRequest) => Promise<IResponse>;
  getAllStaff: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActiveStaff: (pagination: PaginationInfo) => Promise<IResponse>;
  searchStaff: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;
}

export interface StaffRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: number;
  salary: number;
  role: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  contactNumber: number;
  salary: number;
  role: string;
  isActive: boolean;
}
