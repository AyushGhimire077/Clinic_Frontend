import type { IResponse } from "../../../component/global/interface";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  contactNumber?: number;
  type?: string;
  roleId?: string;
  isActive?: boolean;
  token?: string;
  permissions?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  token: string | null;
  error: string | null;
  
  checkAuth: () => void;
  clearAuth: () => void;
  login: (data: AuthRequest) => Promise<IResponse>;
}