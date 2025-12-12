import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { AppointmentState } from "./appointment.interface";
import {
  handleApiError,
  handleApiResponse,
} from "../../../component/global/utils/global.utils.";
 
export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],

  // Create appointment
  create: async (data) => {
    try {
      const res = await axios_auth.post("/appointment/register", data);
      set((state) => ({
        appointments: [...state.appointments, res.data.data],
      }));
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Get all appointments with pagination
  getAllAppointments: async ({ page, size }) => {
    try {
      const res = await axios_auth.get(
        `/appointment/all?page=${page}&size=${size}`
      );
      set({ appointments: res.data.data });
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Get appointments by status
  filterByStatus: async (status, pagination) => {
    try {
      const res = await axios_auth.get(
        `/appointment/all/by-status/${status}?page=${pagination.page}&size=${pagination.size}`
      );

      set({
        appointments: res.data.data || [],
      });

      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Update appointment
  update: async (id: string, data) => {
    try {
      const res = await axios_auth.put(`/appointment/update?id=${id}`, data);
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id ? res.data.data : appointment
        ),
      }));
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id: string) => {
    try {
      const res = await axios_auth.get(`/appointment?id=${id}`);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },
}));
