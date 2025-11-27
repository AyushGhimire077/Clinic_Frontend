import { create } from "zustand";
import { axios_auth } from "../../../../component/global/config";
import type { PatientState } from "./interface";

export const usePatientStore = create<PatientState>((set) => ({
  patientList: [],

  setPatientList: (patientList) => set({ patientList }),

  // CREATE
  createPatient: async (patient) => {
    try {
      const res = await axios_auth.post("/patient/register", patient);
      return res.data;
    } catch (err) {
      return {
        severity: "error",
        status: 500,
        message: "Failed to create patient",
      };
    }
  },

  // GET ALL
  getAllPatients: async (pagination) => {
    try {
      const res = await axios_auth.get("/patient/all", {
        params: { pagination },
      });

      const data = res.data.data || [];
      set({ patientList: data });

      return res.data;
    } catch (err) {
      return {
        severity: "error",
        status: 500,
        message: "Failed to fetch patients",
      };
    }
  },

  // GET ONLY ACTIVE
  getAllActivePatients: async (pagination) => {
    try {
      const res = await axios_auth.get("/patient/active", {
        params: {
          params: { pagination },
        },
      });

      const data = res.data.data || [];
      set({ patientList: data });

      return res.data;
    } catch (err) {
      return {
        severity: "error",
        status: 500,
        message: "Failed to fetch active patients",
      };
    }
  },

  // SEARCH
  searchPatients: async (query, pagination) => {
    try {
      const res = await axios_auth.get("/patient/search", {
        params: {
          name: query,
          pagination,
        },
      });

      const data = res.data.data || [];
      set({ patientList: data });

      return res.data;
    } catch (err) {
      return { severity: "error", status: 500, message: "Search failed" };
    }
  },
}));
