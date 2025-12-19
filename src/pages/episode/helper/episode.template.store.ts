import { create } from "zustand";
import type { EpisodeTempState } from "./episode.interface";
import { EpisodeTemplateService } from "../../../component/api/services/episode.template.service";
import {
  commandWrapper,
  getPagination,
  queryWrapper,
} from "../../../component/global/utils/global.store.helper";

export const useEpisodeTemplateStore = create<EpisodeTempState>((set, get) => ({
  isLoading: false,
  list: [],
  pagination: { currentPage: 0, pageSize: 10 },
  count: null,

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    }));
    get().fetchAll();
  },

  // commands
  create: async (data) =>
    commandWrapper(
      set,
      get,
      async () => await EpisodeTemplateService.create(data),
      get().fetchAll
    ),

  update: async (id, data) =>
    commandWrapper(
      set,
      get,
      async () => await EpisodeTemplateService.update(id, data),
      get().fetchAll
    ),

  enable: async (id) =>
    commandWrapper(
      set,
      get,
      async () => await EpisodeTemplateService.enable(id),
      get().fetchAll
    ),

  disable: async (id) =>
    commandWrapper(
      set,
      get,
      async () => await EpisodeTemplateService.disable(id),
      get().fetchAll
    ),

  remove: async (id) =>
    commandWrapper(
      set,
      get,
      async () => await EpisodeTemplateService.delete(id),
      get().fetchAll
    ),

  // query
  fetchById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await EpisodeTemplateService.getById(id);
      return res.data.data;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAll: async () => {
    queryWrapper(set, get, async () => {
      const params = getPagination(get);
      const res = await EpisodeTemplateService.getAll(params);
      set({ list: res.data.data, pagination: res.data.page });
    });
  },

  fetchActive: async () =>
    queryWrapper(set, get, async () => {
      const params = getPagination(get);
      const res = await EpisodeTemplateService.getActive(params);
      set({ list: res.data.data, pagination: res.data.page });
    }),

  searchByName: async (name) =>
    queryWrapper(set, get, async () => {
      const params = getPagination(get);
      const res = await EpisodeTemplateService.searchByName(name, params);
      set({ list: res.data.data, pagination: res.data.page });
    }),
}));
