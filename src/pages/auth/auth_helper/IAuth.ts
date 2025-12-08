import type { IResponse } from "../../../component/global/interface";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
  contactNumber: number;
}

export interface AuthState {
  user: RegistrationRequest | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (data: AuthRequest) => Promise<IResponse>;
  register: (data: RegistrationRequest) => Promise<IResponse>;
}
