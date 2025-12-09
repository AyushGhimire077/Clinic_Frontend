import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { ServicesState } from "./services.interface";

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

export const useServicesStore = create<ServicesState>((set) => ({
  servicesList: [],
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,

  setServicesList: (servicesList) => set({ servicesList }),

  createServices: async (services) => {
    try {
      const res = await axios_auth.post("/clinic-services/register", services);

      if (res.data?.status === 200 || res.data?.status === 201) {
        set((state) => ({
          servicesList: [res.data.data, ...state.servicesList],
          totalItems: state.totalItems + 1,
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllServices: async (pagination) => {
    try {
      const res = await axios_auth.get("/clinic-services/all", {
        params: pagination,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const servicesList = data?.content || data || [];
        set({
          servicesList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || servicesList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllActiveServices: async (pagination) => {
    try {
      const res = await axios_auth.get("/clinic-services/active", {
        params: pagination,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const servicesList = data?.content || data || [];
        set({
          servicesList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || servicesList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  searchServices: async (query, pagination) => {
    try {
      const res = await axios_auth.get("/clinic-services/search", {
        params: { name: query, ...pagination },
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const servicesList = data?.content || data || [];
        set({
          servicesList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || servicesList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },
}));
