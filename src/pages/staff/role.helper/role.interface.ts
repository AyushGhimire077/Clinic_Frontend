import type {
  PaginationState
} from "../../../component/constant/global.interface";

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
  isLoading: boolean;

  list: IRole[];
  pagination: PaginationState;

  setPage: (page: number) => void;

  // commands
  create: (role: IRoleRequest) => Promise<void>;
  update: (id: string, role: IRoleRequest) => Promise<void>;
  enable: (id: string) => Promise<void>;
  disable: (id: string) => Promise<void>;
  //query
  fetchAll: () => Promise<void>;
  fetchActive: () => Promise<void>;
  search: (name: string) => Promise<void>;
  //  by id
  fetchById: (id: string) => Promise<IRole | null>;
}
