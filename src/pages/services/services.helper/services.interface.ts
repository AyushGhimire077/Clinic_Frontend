import type {
  DoctorType,
  IResponse,
  PaginationInfo,
} from "../../../component/global/interface";

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
  type: DoctorType | "";
}

export interface ServicesState {
  servicesList: IServices[];
  currentPage: number;
  totalPages: number;
  totalItems: number;

  setServicesList: (servicesList: IServices[]) => void;
  createServices: (services: IServicesRequest) => Promise<IResponse>;
  getAllServices: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActiveServices: (pagination: PaginationInfo) => Promise<IResponse>;
  searchServices: (
    query: string,
    pagination: PaginationInfo
  ) => Promise<IResponse>;
}
