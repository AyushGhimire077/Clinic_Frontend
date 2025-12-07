import { create } from "zustand";
import { axios_auth } from "../../../../component/global/config";
import type { EpisodeState } from "./interface";

export const useEpisodeStore = create<EpisodeState>((set) => ({
  episodeList: [],
  loading: false,

  setEpisodeList: (episodeList) => set({ episodeList }),

  createEpisode: async (episode) => {
    const res = await axios_auth.post("/episode/create", episode);
    return res.data;
  },

  getAllEpisodes: async (patientId) => {
    set({ loading: true });

    try {
      const res = await axios_auth.get(`/episode/all?patientId=${patientId}`);
      const data = res.data.data || [];

      set({ episodeList: data, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
