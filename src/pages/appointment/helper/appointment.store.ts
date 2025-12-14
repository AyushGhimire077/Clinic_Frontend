import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { AppointmentState } from "./appointment.interface";
import {
  handleApiResponse,
  handleApiError,
} from "../../../component/utils/ui.helpers";

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  pagination: null,
  startDate: null,
  endDate: null,

  setEndDate: (endDate) => set({ endDate }),
  setStartDate: (startDate) => set({ startDate }),

  setAppointment: (appointment) => set({ appointments: appointment }),
  setPagination: (pagination) => set({ pagination }),
  // Create appointment
  create: async (data) => {
    try {
      const res = await axios_auth.post("/appointment/register", data);
      set((s) => ({
        appointments: [...s.appointments, res.data.data],
      }));
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

  // Get all appointments
  getAll: async (pagination, startDate, endDate) => {
    try {
      const res = await axios_auth.get(`/appointment/all`, {
        params: { ...pagination, startDate, endDate },
      });
      set({ appointments: res.data.data, pagination: res.data.page });
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Get all active appointments
  getAllActive: async (pagination, startDate, endDate) => {
    try {
      const res = await axios_auth.get(`/appointment/active`, {
        params: {
          ...pagination,
          startDate,
          endDate,
        },
      });
      set({ appointments: res.data.data, pagination: res.data.page });
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Get appointments by status
  filterByStatus: async (status, pagination, startDate, endDate) => {
    try {
      const res = await axios_auth.get(`/appointment/all/status`, {
        params: { status, pagination, startDate, endDate },
      });

      set({
        appointments: res.data.data || [],
        pagination: res.data.page,
      });

      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  // Get appointment by ID
  getById: async (id: string) => {
    try {
      const res = await axios_auth.get(`/appointment?id=${id}`);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },
}));
