import { create } from "zustand";
import { axios_auth } from "../../../component/global/config";
import type { EpisodeState } from "./episode.interface";

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
      const res = await axios_auth.get("/episodes", { params: pagination });

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

  getAllEpisodeTemplates: async (pagination) => {
    try {
      const res = await axios_auth.get("/episodes/templates", {
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
