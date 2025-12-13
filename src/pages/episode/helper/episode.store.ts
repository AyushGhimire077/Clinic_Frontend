import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { IResponse } from "../../../component/global/utils/global.interface";
import {
  handleApiError,
  handleApiResponse,
} from "../../../component/global/utils/global.utils.";
import type { EpisodeState } from "./episode.interface";

export const useEpisodeStore = create<EpisodeState>((set) => ({
  episodeList: [],
  episodeTemplateList: [],
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,

  setEpisodeList: (episodeList) => set({ episodeList }),
  setEpisodeTemplateList: (episodeTemplateList) => set({ episodeTemplateList }),

  createEpisode: async (episode) => {
    try {
      const res = await axios_auth.post("/episodes", episode);

      if (res.data?.status === 200 || res.data?.status === 201) {
        set((state) => ({
          episodeList: [res.data.data, ...state.episodeList],
          totalItems: state.totalItems + 1,
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  createEpisodeTemplate: async (template) => {
    try {
      const res = await axios_auth.post("/episodes/templates", template);

      if (res.data?.status === 200 || res.data?.status === 201) {
        set((state) => ({
          episodeTemplateList: [res.data.data, ...state.episodeTemplateList],
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllEpisodes: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/list", {
        params: pagination,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const episodeList = data?.content || data || [];
        set({
          episodeList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || episodeList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllActiveEpisode: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/active", {
        params: pagination,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const episodeList = data?.content || data || [];
        set({
          episodeList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || episodeList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  //cancel ep
  cancelEpisode: async (id: string) => {
    try {
      const res = await axios_auth.patch(`/episodes/${id}/cancel`);

      if (res.data?.status === 200) {
        set((state) => ({
          episodeList: state.episodeList.map((e) =>
            e.id === id ? { ...e, isActive: false } : e
          ),
        }));
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllEpisodeTemplates: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/templates/list", {
        params: pagination,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        const episodeTemplateList = data?.content || data || [];
        set({
          episodeTemplateList,
          currentPage: pagination.page || 0,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || episodeTemplateList.length,
        });
      }

      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getEpisodeById: async (id) => {
    try {
      const res = await axios_auth.get(`/episodes/${id}`);
      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getEpisodeTemplateById: async (id) => {
    try {
      const res = await axios_auth.get(`/episodes/templates/${id}`);
      return handleApiResponse(res);
    } catch (error: any) {
      return handleApiError(error);
    }
  },
}));
