import { create } from "zustand";
import type { PatientState } from "./patient.interface";
import { PatientService } from "../../../component/api/services/patient.service";

export const usePatientStore = create<PatientState>((set, get) => ({
  isLoading: false,
  list: [],
  pagination: { currentPage: 0, pageSize: 10 },
  count: null,

  setPage: (page: number) =>
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    })),

  // commands
  create: async (patient) => {
    set({ isLoading: true });
    try {
      await PatientService.create(patient);
      await get().fetchAll();
      await get().fetchCount();
    } finally {
      set({ isLoading: false });
    }
  },
  update: async (id, patient) => {
    set({ isLoading: true });
    try {
      await PatientService.update(id, patient);
      await get().fetchAll();
    } finally {
      set({ isLoading: false });
    }
  },
  enable: async (id) => {
    set({ isLoading: true });
    try {
      await PatientService.enable(id);
      await get().fetchAll();
    } finally {
      set({ isLoading: false });
    }
  },
  disable: async (id) => {
    set({ isLoading: true });
    try {
      await PatientService.disable(id);
      await get().fetchAll();
    } finally {
      set({ isLoading: false });
    }
  },

  //query
  fetchById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await PatientService.getById(id);
      return res.data.data;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { pagination } = get();

      const res = await PatientService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({ list: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchActive: async () => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const res = await PatientService.getActive({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({ list: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },
  search: async (name) => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const res = await PatientService.searchByName(name, {
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({ list: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCount: async () => {
    set({ isLoading: true });
    try {
      const res = await PatientService.count();
      set({ count: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },
}));
