import { create } from "zustand";
import {
  axios_no_auth,
  getDecodedToken,
  getTokenFromCookies,
} from "../../../component/global/config";
import type { IResponse } from "../../../component/global/utils/enums";
import type {
  AuthRequest,
  AuthState,
  IUser,
} from "../interface/auth.interface";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getTokenFromCookies() || null,
  error: null,
  isAuthenticated: false,
  isLoading: false,

  clearAuth: () => {
    set({
      user: null,
      token: null,
      error: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuth: () => {
    const token = getTokenFromCookies();
    const decoded = getDecodedToken();

    set({
      token,
      user: decoded as IUser,
      isAuthenticated: !!token,
    });
  },
  login: async (data: AuthRequest): Promise<IResponse> => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios_no_auth.post("/auth/login", data);
      const responseData = res.data?.data;

      set({
        user: responseData as IUser,
        token: responseData.token,
        isLoading: false,
        isAuthenticated: true,
      });

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity.toLowerCase(),
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });

      return {
        message: errorMessage,
        status: err.response?.status || 500,
        severity: "error",
      };
    }
  },
}));
