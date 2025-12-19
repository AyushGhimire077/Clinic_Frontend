import { create } from "zustand";
import { StaffService } from "../../../component/api/services/staff.service";
import type { StaffState } from "./staff.interface";

export const useStaffStore = create<StaffState>((set, get) => ({
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
  create: async (staff) => {
    set({ isLoading: true });
    try {
      await StaffService.create(staff);
      await get().fetchAll();
      await get().fetchCount();
    } finally {
      set({ isLoading: false });
    }
  },

  update: async (id, staff) => {
    set({ isLoading: true });
    try {
      await StaffService.update(id, staff);
      await get().fetchAll();
    } finally {
      set({ isLoading: false });
    }
  },

  enable: async (id) => {
    set({ isLoading: true });
    try {
      await StaffService.enable(id);
      await get().fetchAll();
    } finally {
      set({ isLoading: false });
    }
  },

  disable: async (id) => {
    set({ isLoading: true });
    try {
      await StaffService.disable(id);
      await get().fetchAll();
    } finally {
      set({ isLoading: false });
    }
  },

  remove: async (id) => {
    set({ isLoading: true });
    try {
      await StaffService.delete(id);
      await get().fetchAll();
      await get().fetchCount();
    } finally {
      set({ isLoading: false });
    }
  },

  //query

  fetchById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await StaffService.getById(id);
      return res.data.data;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const res = await StaffService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({
        list: res.data.data,
        pagination: res.data.page,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActive: async () => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const res = await StaffService.getActive({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({
        list: res.data.data,
        pagination: res.data.page,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  search: async (name) => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const res = await StaffService.searchByName(name, {
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({
        list: res.data.data,
        pagination: res.data.page,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCount: async () => {
    set({ isLoading: true }); 
    try {
      const res = await StaffService.count();
      set({ count: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },
}));
