import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import {
  handleApiError,
  handleApiResponse,
} from "../../../component/global/utils/global.utils.";
import type { EpisodeState } from "./episode.interface";

export const useEpisodeStore = create<EpisodeState>((set) => ({
  episodeList: [],
  episodeTemplateList: [],
  pagination: null,

  /* CREATE */

  createEpisode: async (payload) => {
    try {
      const res = await axios_auth.post("/episodes", payload);

      set((s) => ({
        episodeList: [res.data.data, ...s.episodeList],
      }));

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  createEpisodeTemplate: async (payload) => {
    try {
      const res = await axios_auth.post("/episodes/templates", payload);

      set((s) => ({
        episodeTemplateList: [res.data.data, ...s.episodeTemplateList],
      }));
      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  /* GET LIST */

  getAllEpisodes: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/list", {
        params: pagination,
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

  filterByStatus: async (status, pagination) => {
    try {
      const res = await axios_auth.get(`/episodes/list/status`, {
        params: { status, pagination },
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

  getAllActiveEpisodes: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/active", {
        params: pagination,
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
      const res = await axios_auth.get(`/episodes/${id}/cancel`);

      return handleApiResponse(res);
    } catch (e) {
      return handleApiError(e);
    }
  },

  /* TEMPLATES */

  getAllEpisodeTemplates: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/templates/list", {
        params: pagination,
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
