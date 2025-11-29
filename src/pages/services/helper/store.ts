import { create } from "zustand";
import type { ServicesState } from "./interface";
import { axios_auth } from "../../../component/global/config";

export const userServiceStore = create<ServicesState>((set) => ({
  servicesList: [],
  setServicesList: (servicesList) =>
    set(() => ({
      servicesList,
    })),

  createServices: async (services) => {
    const res = await axios_auth.post("/clinic-services/register", services);

    return res.data;
  },

  getAllServices: async ({ page, size }) => {
    const res = await axios_auth.get("/clinic-services/all", {
      params: { page, size },
    });
    const list = res.data.data ?? [];
    set({ servicesList: list });
    return res.data;
  },

  getAllActiveServices: async ({ page, size }) => {
    const res = await axios_auth.get("/clinic-services/active", {
      params: { page, size },
    });
    const list = res.data.data ?? [];
    set({ servicesList: list });
    return res.data;
  },

  searchServices: async (query, { page, size }) => {
    const res = await axios_auth.get(`/clinic-services/search`, {
      params: { name: query, page, size },
    });
    const list = res.data.data ?? [];
    set({ servicesList: list });
    return res.data;
  },
}));
