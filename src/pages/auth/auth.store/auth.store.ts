import { create } from "zustand";
import {
  getDecodedToken,
  getTokenFromCookies,
} from "../../../component/global/config";
import type {
  AuthRequest,
  AuthState,
  IUser,
} from "../auth.interface/auth.interface";
import type { IResponse } from "../../../component/constant/global.interface";
import { AuthService } from "../../../component/api/services/auth.service";
import {
  handleApiError,
  handleApiResponse,
} from "../../../component/utils/ui.helpers";

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
      const res = await AuthService.signin(data);
      const responseData = res.data.data;

      set({
        user: responseData as IUser,
        token: responseData.token,
        isLoading: false,
        isAuthenticated: true,
      });

      return handleApiResponse(res);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });

      return handleApiError(err);
    }
  },
}));
