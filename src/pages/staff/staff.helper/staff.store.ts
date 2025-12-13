import { create } from "zustand";
import type { StaffState } from "./staff.interface";
import { axios_auth } from "../../../component/global/config";
import {
  handleApiError,
  handleApiResponse,
} from "../../../component/global/utils/global.utils.";

export const useStaffStore = create<StaffState>((set) => ({
  staffList: [],
  pagination: null,
  count: null,

  setStaffList: (staffList) => set({ staffList }),
  setPagination: (pagination) => set({ pagination }),

  // CREATE STAFF
  createStaff: async (staff) => {
    try {
      const res = await axios_auth.post("/staff", staff);

      if (res.data?.status === 201 || res.data?.status === 200) {
        set((s) => ({
          staffList: [...s.staffList, res.data.data],
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // GET ALL STAFF (PAGINATION)
  getAllStaff: async (pagination) => {
    try {
      const res = await axios_auth.get("/staff/list", { params: pagination });

      if (res.data?.status === 200) {
        set({
          staffList: res.data.data || [],
          pagination: res.data.page || null,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // GET ACTIVE STAFF (PAGINATION)
  getAllActiveStaff: async (pagination) => {
    try {
      const res = await axios_auth.get("/staff/active", { params: pagination });

      if (res.data?.status === 200) {
        set({
          staffList: res.data.data || [],
          pagination: res.data.page || null,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // COUNT
  countStaff: async () => {
    try {
      const res = await axios_auth.get("/staff/count");

      if (res.data.status == 200) {
        set({
          count: res.data.data,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // SEARCH STAFF (PAGINATION)
  searchStaff: async (query: string, pagination) => {
    try {
      const res = await axios_auth.get("/staff/search", {
        params: { name: query, ...pagination },
      });

      if (res.data?.status === 200) {
        set({
          staffList: res.data.data || [],
          pagination: res.data.page || null,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },
}));
