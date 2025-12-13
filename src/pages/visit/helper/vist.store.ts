import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { VisitStatus } from "../../../component/global/utils/enums";
import {
  handleApiError,
  handleApiResponse,
} from "../../../component/global/utils/global.utils.";
import type { IVisit, IVisitCreate, IVisitState } from "./vist.interface";

export const useVisitStore = create<IVisitState>((set, get) => ({
  visitList: [],
  loading: false,
  filter: "",
  startDate: null,
  endDate: null,

  setStartDate: (date: string | null) => set({ startDate: date }),
  setEndDate: (date: string | null) => set({ endDate: date }),

  setFilter: (status) => set({ filter: status }),

  // UPDATE VISIT
  updateVisit: async (id: string, data: IVisitCreate) => {
    try {
      set({ loading: true });
      const res = await axios_auth.put(`/visit/update/${id}`, data);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  getVisitById: async (id: string) => {
    try {
      set({ loading: true });
      const res = await axios_auth.get(`/visit?id=${id}`);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  startVisit: async (id: string) => {
    try {
      const res = await axios_auth.post(`/visit/start/${id}`);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  completeVisit: async (id: string) => {
    try {
      const res = await axios_auth.post(`/visit/complete/${id}`);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  cancelVisit: async (id: string) => {
    try {
      const res = await axios_auth.post(`/visit/cancel/${id}`);
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    }
  },

  countByStatus: async (status) => {
    try {
      set({ loading: true });

      const start = get().startDate;
      const end = get().endDate;

      const params = {
        status,
        startDate: start && end ? start : null,
        endDate: start && end ? end : null,
      };

      const res = await axios_auth.get(`/visit/count`, { params });

      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  getVisitsByStatus: async (status: VisitStatus | "", page, size) => {
    try {
      set({ loading: true });

      const start = get().startDate;
      const end = get().endDate;

      const params = {
        status,
        page,
        size,
        startDate: start && end ? start : null,
        endDate: start && end ? end : null,
      };

      const res = await axios_auth.get(`/visit/status`, {
        params,
      });
      set({ visitList: res.data.data as IVisit[] });
      return handleApiResponse(res);
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },
}));
