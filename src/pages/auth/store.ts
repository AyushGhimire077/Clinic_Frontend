import { create } from "zustand";
import { axios_no_auth, getUsernameFromCookies } from "../global/config";
 import type { AuthRequest, AuthState, RegistrationRequest } from "./auth_helper/IAuth";
import type { IResponse } from "../global/interface";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getUsernameFromCookies() || null,
  loading: false,
  error: null,

  login: async (data: AuthRequest): Promise<IResponse> => {
    set({ loading: true, error: null });
    try {
      const res = await axios_no_auth.post("/auth/login", data);
      const token = res.data?.data; 
      set({ token, loading: false });

 
      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity.toLowerCase() as "success" | "error" | "info" | "warning"
      };
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Login failed", loading: false });
      return {
        message: err.response?.data?.message || "Login failed",
        status: err.response?.status || 500,
        severity: "error"
      };
    }
  },

  register: async (data: RegistrationRequest): Promise<IResponse> => {
    set({ loading: true, error: null });
    try {
      const res = await axios_no_auth.post("/auth/register", data);
       set({ user: res.data?.data || null, loading: false });

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity.toLowerCase() as "success" | "error" | "info" | "warning"
      };
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Registration failed", loading: false });
      return {
        message: err.response?.data?.message || "Registration failed",
        status: err.response?.status || 500,
        severity: "error"
      };
    }
  },

}));
