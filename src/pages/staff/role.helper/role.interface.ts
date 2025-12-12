import type {
  IResponse,
  PaginationInfo,
} from "../../../component/global/utils/enums";

export interface IRoleRequest {
  role: string;
  permissions: string[];
  isActive: boolean;
}

export interface IRole {
  id: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

export interface RoleState {
  roles: IRole[];
  currentPage: number;
  totalPages: number;
  totalItems: number;

  setRoles: (roles: IRole[]) => void;
  createRole: (role: IRoleRequest) => Promise<IResponse>;
  updateRole: (id: string, role: IRoleRequest) => Promise<IResponse>;
  enableRole: (id: string) => Promise<IResponse>;
  disableRole: (id: string) => Promise<IResponse>;
  getAllRoles: (pagination: PaginationInfo) => Promise<IResponse>;
  getAllActiveRoles: (pagination: PaginationInfo) => Promise<IResponse>;
}
