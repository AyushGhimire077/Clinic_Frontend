import { create } from "zustand";
import { axios_auth } from "../../../../../component/global/config";
import type { StaffState } from "./interface";

export const useStaffStore = create<StaffState>((set) => ({
  staffList: [],
  setStaffList: (staffList) => set({ staffList }),

  createStaff: async (staff) => {
    try {
      const res = await axios_auth.post("/staff/register", staff);

      if (res.data?.status === 201 || res.data?.status === 200) {
        set((s) => ({ staffList: [...s.staffList, res.data.data] }));
      }

      return {
        message: res.data?.message || "Request completed",
        status: res.data?.status || 500,
        severity: res.data?.severity?.toLowerCase() || "error",
      };
    } catch (error: any) {
      return {
        message:
          error?.response?.data?.message || error?.message || "Request failed",
        status: error?.response?.status || 500,
        severity: "error",
      };
    }
  },

  getAllStaff: async (pagination) => {
    try {
      const res = await axios_auth.get("/staff/all", { params: pagination });

      if (res.data?.status === 200) {
        set({ staffList: res.data.data || [] });
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase(),
      };
    } catch (error: any) {
      return {
        message:
          error?.response?.data?.message || error?.message || "Request failed",
        status: error?.response?.status || 500,
        severity: "error",
      };
    }
  },

  getAllActiveStaff: async (pagination) => {
    try {
      const res = await axios_auth.get("/staff/active", { params: pagination });

      if (res.data?.status === 200) {
        set({ staffList: res.data.data || [] });
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase(),
      };
    } catch (error: any) {
      return {
        message:
          error?.response?.data?.message || error?.message || "Request failed",
        status: error?.response?.status || 500,
        severity: "error",
      };
    }
  },

  searchStaff: async (query: string, pagination) => {
    try {
      const res = await axios_auth.get("/staff/search", {
        params: { query, ...pagination },
      });
      if (res.data?.status === 200) {
        set({ staffList: res.data.data || [] });
      }

      return {
        message: res.data.message,
        status: res.data.status,
        severity: res.data.severity?.toLowerCase(),
      };
    } catch (error: any) {
      return {
        message:
          error?.response?.data?.message || error?.message || "Request failed",
        status: error?.response?.status || 500,
        severity: "error",
      };
    }
  },
}));
