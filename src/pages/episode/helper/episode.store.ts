import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";

import type { EpisodeState } from "./episode.interface";
import {
  handleApiResponse,
  handleApiError,
} from "../../../component/utils/ui.helpers";

export const useEpisodeStore = create<EpisodeState>((set, get) => ({
  episodeList: [],
  episodeTemplateList: [],
  pagination: null,
  startDate: null,
  endDate: null,
  count: null,

  /* STATE SETTERS */
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setPagination: (pagination) => set({ pagination }),
  setEpisodeList: (episodeList) => set({ episodeList }),
  setEpisodeTemplateList: (episodeTemplateList) => set({ episodeTemplateList }),

  /* CREATE */
  createEpisode: async (payload) => {
    try {
      const res = await axios_auth.post("/episodes", payload);

      if (res.data?.status === 200) {
        set((s) => ({
          episodeList: [res.data.data, ...s.episodeList],
        }));
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  createEpisodeTemplate: async (payload) => {
    try {
      const res = await axios_auth.post("/episodes/templates", payload);

      if (res.data?.status === 200) {
        set((s) => ({
          episodeTemplateList: [res.data.data, ...s.episodeTemplateList],
        }));
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  countEpisodes: async () => {
    try {
      const res = await axios_auth.get("/episodes/count", {
        params: {
          startDate: get().startDate,
          endDate: get().endDate,
        },
      });

      if (res.data?.status === 200) {
        set({ count: res.data.data });
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  // SEARCH
  searchEpisodes: async (query, pagination) => {
    try {
      const res = await axios_auth.get("/episodes/search", {
        params: {
          query,
          pagination,
        },
      });
      if (res.data?.status === 200) {
        set({
          episodeList: res.data.data,
          pagination: res.data.page,
        });
      }
      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  /* GET LIST  */

  filterByStatus: async (status, pagination) => {
    try {
      const res = await axios_auth.get("/episodes/status", {
        params: {
          status,
          pagination,
          startDate: get().startDate,
          endDate: get().endDate,
        },
      });

      if (res.data?.status === 200) {
        set({
          episodeList: res.data.data,
          pagination: res.data.page,
        });
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  getAllEpisodes: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/list", {
        params: {
          pagination,
          startDate: get().startDate,
          endDate: get().endDate,
        },
      });

      if (res.data?.status === 200) {
        set({
          episodeList: res.data.data,
          pagination: res.data.page,
          startDate: get().startDate,
          endDate: get().endDate,
        });
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  /* SINGLE */
  getEpisodeById: async (id) => {
    try {
      const res = await axios_auth.get(`/episodes/${id}`);
      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  /* CANCEL */
  cancelEpisode: async (id) => {
    try {
      const res = await axios_auth.patch(`/episodes/${id}/cancel`);

      if (res.data?.status === 200) {
        set((s) => ({
          episodeList: s.episodeList.map((e: any) =>
            e.id === id ? { ...e, status: "CANCELLED", isActive: false } : e
          ),
        }));
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  /* TEMPLATES */
  getAllEpisodeTemplates: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/templates/list", {
        params: {
          pagination,
          startDate: get().startDate,
          endDate: get().endDate,
        },
      });

      if (res.data?.status === 200) {
        set({
          episodeTemplateList: res.data.data,
          pagination: res.data.page,
        });
      }

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  getEpisodeTemplateById: async (id) => {
    try {
      const res = await axios_auth.get(`/episodes/templates/${id}`);
      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },
}));
