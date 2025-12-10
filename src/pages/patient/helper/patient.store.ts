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
  count: new Map<string, object>(),

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

  editPatient: async (id, patient) => {
    try {
      const res = await axios_auth.put(`/patient/update/${id}`, patient);
      if (res.data?.status === 200) {
        set((state) => ({
          patientList: state.patientList.map((p) =>
            p.id === id ? res.data.data : p
          ),
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

  // count section
  countPatients: async () => {
    try {
      const res = await axios_auth.get("/patient/count");

      set((state) => {
        state.count.clear();
        const data = res.data.data;
        for (const key in data) {
          state.count.set(key, data[key]);
        }
        return { count: state.count };
      });

      console.log(res.data.data);

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // enable disable section
  enablePatient: async (id) => {
    try {
      const res = await axios_auth.get(`/patient/enable/${id}`);

      if (res.data?.status === 200) {
        set((state) => ({
          patientList: state.patientList.map((patient) =>
            patient.id === id ? { ...patient, isActive: true } : patient
          ),
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  disablePatient: async (id) => {
    try {
      const res = await axios_auth.get(`/patient/disable/${id}`);

      if (res.data?.status === 200) {
        set((state) => ({
          patientList: state.patientList.map((patient) =>
            patient.id === id ? { ...patient, isActive: false } : patient
          ),
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },
}));
