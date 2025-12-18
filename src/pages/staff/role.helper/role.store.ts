import { create } from "zustand";
import { RoleService } from "../../../component/api/services/role.service";
import { axios_auth } from "../../../component/global/config";
import type { RoleState, IRoleRequest, IRole } from "./role.interface";

export const useRoleStore = create<RoleState>((set, get) => ({
  isLoading: false,
  list: [],
  pagination: { currentPage: 0, pageSize: 10 },

  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    }));
    get().fetchAll();
  },
  // commands
  create: async (role: IRoleRequest) => {
    set({ isLoading: true });
    try {
      await RoleService.create(role);
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  update: async (id: string, role: IRoleRequest) => {
    set({ isLoading: true });
    try {
      await RoleService.update(id, role);
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  enable: async (id: string) => {
    set({ isLoading: true });
    try {
      await RoleService.enable(id);
    } catch (error) {
      console.error("Error enabling role:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  disable: async (id: string) => {
    set({ isLoading: true });
    try {
      await axios_auth.patch(`/roles/${id}/disable`);
    } catch (error) {
      console.error("Error disabling role:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  //query
  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const response = await RoleService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({ list: response?.data?.data });
    } catch (error) {
      console.error("Error fetching all roles:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActive: async () => {
    set({ isLoading: true });
    try {
      const { pagination } = get();

      const response = await RoleService.getActive({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({ list: response?.data?.data });
    } catch (error) {
      console.error("Error fetching active roles:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  search: async (name: string) => {
    set({ isLoading: true });
    try {
      const { pagination } = get();
      const response = await RoleService.searchByName(name, {
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      set({ list: response?.data?.data });
    } catch (error) {
      console.error("Error searching roles by name:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  //  by id
  fetchById: async (id: string) => {
    const response = await RoleService.getById(id);
    return response.data.data as IRole;
  },
}));
