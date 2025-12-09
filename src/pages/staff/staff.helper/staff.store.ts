import { create } from "zustand";
import type { StaffState } from "./staff.interface";
import { axios_auth } from "../../../component/global/config";

const handleApiResponse = (res: any) => ({
  message: res.data?.message || "Request completed",
  status: res.data?.status || 500,
  severity: res.data?.severity?.toLowerCase() || "error",
});

const handleApiError = (error: any) => ({
  message: error?.response?.data?.message || error?.message || "Request failed",
  status: error?.response?.status || 500,
  severity: "error",
});

export const useStaffStore = create<StaffState>((set) => ({
  staffList: [],
  setStaffList: (staffList) => set({ staffList }),

  createStaff: async (staff) => {
    try {
      const res = await axios_auth.post("/staff/register", staff);

      if (res.data?.status === 201 || res.data?.status === 200) {
        set((s) => ({ staffList: [...s.staffList, res.data.data] }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllStaff: async (pagination) => {
    try {
      const res = await axios_auth.get("/staff/all", { params: pagination });

      if (res.data?.status === 200) {
        set({ staffList: res.data.data || [] });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllActiveStaff: async (pagination) => {
    try {
      const res = await axios_auth.get("/staff/active", { params: pagination });

      if (res.data?.status === 200) {
        set({ staffList: res.data.data || [] });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  searchStaff: async (query: string, pagination) => {
    try {
      const res = await axios_auth.get("/staff/search", {
        params: { name: query, ...pagination },
      });

      if (res.data?.status === 200) {
        set({ staffList: res.data.data || [] });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },
}));
