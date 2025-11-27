import { create } from "zustand";
import { axios_auth } from "../../../../../component/global/config";
import type { IRole, RoleState } from "./interface";

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],

  create_role: async (data) => {
    try {
      const res = await axios_auth.post("/role/register", {
        role: data.role,
        permissions: data.permissions,
        isActive: data.is_active,
      });

      if (res.data?.status === 200) {
        set((s) => ({ roles: [...s.roles, res.data.data as IRole] }));
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase(),
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Request failed",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },

  get_all_roles: async () => {
    try {
      const res = await axios_auth.get("/role/all");

      if (res.data?.status === 200) {
        set({ roles: res.data.data || [] });
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase(),
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Request failed",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },
}));
