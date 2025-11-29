import type { IResponse, PaginationInfo, StaffType } from "../../../component/global/interface";
 
export interface IServices {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  charge: number;
  type: string;
}

export interface IServicesRequest {
  name: string;
  description: string;
  charge: number;
  type: StaffType;
}

export interface ServicesState {
  servicesList: IServices[];
  setServicesList: (servicesList: IServices[]) => void;

  createServices: (services: IServicesRequest) => Promise<IResponse>;
  getAllServices: (page : PaginationInfo) => Promise<IResponse>;
  getAllActiveServices: (page : PaginationInfo) => Promise<IResponse>;
  searchServices: (query: string, page : PaginationInfo) => Promise<IResponse>;
}
