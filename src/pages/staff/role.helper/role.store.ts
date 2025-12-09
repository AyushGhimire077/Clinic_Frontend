import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { IRole, IRoleRequest, RoleState } from "./role.interface";

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,

  setRoles: (roles) => set({ roles }),

  createRole: async (data) => {
    try {
      const res = await axios_auth.post("/role/register", data);

      if (res.data?.status === 200) {
        const newRole: IRole = {
          id: res.data.data?.id || `role-${Date.now()}`,
          role: data.role,
          permissions: data.permissions,
          isActive: data.isActive,
        };

        set((state) => ({
          roles: [newRole, ...state.roles],
          totalItems: state.totalItems + 1,
        }));
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase() || "success",
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Failed to create role",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },

  updateRole: async (id: string, data: IRoleRequest) => {
    try {
      const res = await axios_auth.post(`/role/update/${id}`, data);

      if (res.data?.status === 200) {
        set((state) => ({
          roles: state.roles.map((role) =>
            role.id === id ? { ...role, ...data } : role
          ),
        }));
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase() || "success",
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Failed to update role",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },

  enableRole: async (id: string) => {
    try {
      const res = await axios_auth.get(`/role/${id}/enable`);

      if (res.data?.status === 200) {
        set((state) => ({
          roles: state.roles.map((role) =>
            role.id === id ? { ...role, isActive: true } : role
          ),
        }));
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase() || "success",
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Failed to enable role",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },

  disableRole: async (id: string) => {
    try {
      const res = await axios_auth.get(`/role/${id}/disable`);

      if (res.data?.status === 200) {
        set((state) => ({
          roles: state.roles.map((role) =>
            role.id === id ? { ...role, isActive: false } : role
          ),
        }));
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase() || "success",
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Failed to disable role",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },

  getAllRoles: async (pagination) => {
    try {
      const res = await axios_auth.get("/role/all", { params: pagination });

      if (res.data?.status === 200) {
        const roles = res.data.data?.content || res.data.data || [];
        set({
          roles,
          currentPage: pagination.page,
          totalPages: res.data.data?.totalPages || 1,
          totalItems: res.data.data?.totalElements || roles.length,
        });
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase() || "success",
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Failed to fetch roles",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },

  getAllActiveRoles: async (pagination) => {
    try {
      const res = await axios_auth.get("/role/active", { params: pagination });

      if (res.data?.status === 200) {
        const roles = res.data.data?.content || res.data.data || [];
        set({
          roles,
          currentPage: pagination.page,
          totalPages: res.data.data?.totalPages || 1,
          totalItems: res.data.data?.totalElements || roles.length,
        });
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase() || "success",
      };
    } catch (err: any) {
      return {
        message: err?.response?.data?.message || "Failed to fetch active roles",
        status: err?.response?.status || 500,
        severity: "error",
      };
    }
  },
}));
