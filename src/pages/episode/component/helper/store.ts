import { create } from "zustand";
import { axios_auth } from "../../../../component/global/config";
import type { EpisodeState } from "./interface";

export const useEpisodeStore = create<EpisodeState>((set) => ({
  episodeList: [],
  episodeTemplateList: [],
  loading: false,

  // State setters
  setEpisodeList: (episodes) => set({ episodeList: episodes }),
  setEpisodeTemplateList: (templates) =>
    set({ episodeTemplateList: templates }),

  // Create new episode
  createEpisode: async (episode) => {
    const res = await axios_auth.post("episodes", episode);
    return res.data;
  },

  // Create new episode template
  createEpisodeTemplate: async (template) => {
    const res = await axios_auth.post("episodes/templates", template);
    return res.data;
  },

  // Fetch all episodes (paginated)
  getAllEpisodes: async ({ page = 0, size = 10 }) => {
    set({ loading: true });
    try {
      const res = await axios_auth.get(
        `episodes?page=${page}&size=${size}`
      );
      const data = res.data.data || [];
      set({ episodeList: data, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Fetch all episode templates (paginated)
  getAllEpisodeTemplates: async ({ page = 0, size = 10 }) => {
    set({ loading: true });
    try {
      const res = await axios_auth.get(
        `episodes/templates?page=${page}&size=${size}`
      );
      const data = res.data.data || [];
      set({ episodeTemplateList: data, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Fetch single episode by ID
  getEpisodeById: async (id: string) => {
    const res = await axios_auth.get(`episodes/${id}`);
    return res.data;
  },

  // Fetch single episode template by ID
  getEpisodeTemplateById: async (id: string) => {
    const res = await axios_auth.get(`episodes/templates/${id}`);
    return res.data;
  },
}));
