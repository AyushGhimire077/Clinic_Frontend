import type { AuthRequest } from "../../../pages/auth/auth.interface/auth.interface";
import { axios_auth } from "../../global/config";
import { AUTH_ENDPOINTS } from "../endpoints/auth.endpoint";

export const AuthService = {
  signin: (data: AuthRequest) => axios_auth.post(AUTH_ENDPOINTS.SIGNIN, data),
};
