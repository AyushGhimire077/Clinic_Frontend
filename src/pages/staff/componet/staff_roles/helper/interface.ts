import type { IResponse } from "../../../../global/interface";

export interface IRoleRequest {
  role: string;
  permissions: string[];
  is_active: boolean; // frontend shape
}

export interface IRole {
  id: string;
  role: string;
  permissions: string[];
  is_active: boolean; // frontend shape
}

 

export interface RoleState {
  roles: IRole[];

  create_role: (role: IRoleRequest) => Promise<IResponse>;
  get_all_roles: () => Promise<IResponse>;
}