import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type {   AppointmentState } from "./interface";

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],

  // Create appointment
  create: async (data ) => {
    try {
      const res = await axios_auth.post("/appointment/register", data);
      set((state) => ({
        appointments: [...state.appointments, res.data.data],
      }));
      return res.data;
    } catch (err: any) {
      return {
        status: err.response?.status || 500,
        message: err.message,
        data: null,
      };
    }
  },

  // Get all appointments with pagination
  getAllAppointments: async (pagination) => {
    try {
      const res = await axios_auth.get(`/appointment/all`, {
        params: { pagination },
      });
      set({ appointments: res.data.data });
      return res.data;
    } catch (err: any) {
      return {
        status: err.response?.status || 500,
        message: err.message,
        data: null,
      };
    }
  },

  // Get appointments by status
  getByStatus: async (status, pagination) => {
    try {
      const res = await axios_auth.get(`/appointment/all/by-status/${status}`, {
        params: { pagination },
      });
      set({ appointments: res.data.data });
      return res.data;
    } catch (err: any) {
      return {
        status: err.response?.status || 500,
        message: err.message,
        data: null,
      };
    }
  },
}));
