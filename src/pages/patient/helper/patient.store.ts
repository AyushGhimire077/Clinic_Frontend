import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { PatientState } from "./patient.interface";

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

export const usePatientStore = create<PatientState>((set) => ({
  patientList: [],
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,

  setPatientList: (patientList) => set({ patientList }),

  createPatient: async (patient) => {
    try {
      const res = await axios_auth.post("/patient/register", patient);

      if (res.data?.status === 200 || res.data?.status === 201) {
        set((state) => ({
          patientList: [res.data.data, ...state.patientList],
          totalItems: state.totalItems + 1,
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllPatients: async (pagination) => {
    try {
      const res = await axios_auth.get("/patient/all", { params: pagination });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const patientList = data?.content || data || [];
        set({
          patientList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || patientList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllActivePatients: async (pagination) => {
    try {
      const res = await axios_auth.get("/patient/active", {
        params: pagination,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const patientList = data?.content || data || [];
        set({
          patientList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || patientList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  searchPatients: async (query, pagination) => {
    try {
      const res = await axios_auth.get("/patient/search", {
        params: { name: query, ...pagination },
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const patientList = data?.content || data || [];
        set({
          patientList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || patientList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getPatientById: async (id) => {
    try {
      const res = await axios_auth.get(`/patient/${id}`);
      if (res.data) {
        return res.data.data;
      } else {
        return null;
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },
}));
