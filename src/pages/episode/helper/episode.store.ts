import { create } from "zustand";
import { EpisodeService } from "../../../component/api/services/episdoe.service";
import {
  commandWrapper,
  getPagination,
  queryWrapper,
} from "../../../component/global/utils/global.store.helper";
import type { EpisodeState } from "./episode.interface";

export const useEpisodeStore = create<EpisodeState>((set, get) => ({
  list: [],
  isLoading: false,
  pagination: { currentPage: 0, pageSize: 10 },
  range: { startDate: null, endDate: null },
  count: { total: 0, active: 0, completed: 0, cancelled: 0 },

  setPage: (page: number) =>
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    })),

  /* -------- Commands -------- */
  create: async (data) =>
    commandWrapper(set, get, async () => await EpisodeService.create(data), get().fetchAll),
  
  remove: async (id) =>
    commandWrapper(set, get, async () => await EpisodeService.delete(id), get().fetchAll),
  changeStatus: async (id, status) =>
    commandWrapper(set, get, async () => await EpisodeService.changeStatus(id, status), get().fetchAll),
  changeType: async (id, type) =>
    commandWrapper(set, get, async () => await EpisodeService.changeType(id, type), get().fetchAll),
  changeBillingMode: async (id, billingMode) =>
    commandWrapper(set, get, async () => await EpisodeService.changeBillingMode(id, billingMode), get().fetchAll),
  /* -------- Queries -------- */
  fetchAll: async () =>
    queryWrapper(set, get, async ()  =>  { 
        const params = getPagination(get);
        await EpisodeService.getAll(params); 
    }, get().countAll ),
  fetchActive: async () =>
    queryWrapper(set, get, async ()  => {
        const params = getPagination(get);
        await EpisodeService.getActive(params); 
    }),

  fetchByStatus: async (status) =>
    queryWrapper(set, get, async ()  => {
        const params = getPagination(get);
        await EpisodeService.getByStatus(status, params);
    }),
  fetchByRange: async (range) => {
    const r = range || get().range;
    await queryWrapper(set, get, async ()  => {
        const params = getPagination(get);
        await EpisodeService.getByRange(r, params);
    });
  },
  fetchByStatusRange: async (status: string, range) => {
    const r = range || get().range;
    await queryWrapper(set, get, () => {
        const params = getPagination(get);
        return EpisodeService.getByStatusRange(status, r, params); 
    }
    );
  },

  /* -------- Counts -------- */
countAll: async () =>
  queryWrapper(set, get, async () => {
    const res = await EpisodeService.countAllTime();
    set({ count: res.data.data });
  }),
  

  countByRange: async (range) => {
    const r = range || get().range;
    await queryWrapper(set, get, async () => {
      const res = await EpisodeService.countByRange(r);
      set({ count: res.data.data });
    });
  },
}));
