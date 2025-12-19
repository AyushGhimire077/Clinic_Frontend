// component/api/services/staff.service.ts
import type { IStaffRequest } from "../../../pages/staff/staff.helper/staff.interface";
import type { PaginationInfo } from "../../constant/global.interface";
import { axios_auth } from "../../global/config";
import { STAFF_ENDPOINTS } from "../endpoints/staff.endpoint";

export const StaffService = {
  // Command
  create: (data: IStaffRequest) =>
    axios_auth.post(STAFF_ENDPOINTS.CREATE, data),

  update: (id: string, data: IStaffRequest) =>
    axios_auth.put(STAFF_ENDPOINTS.UPDATE.replace("{id}", id), data),

  enable: (id: string) =>
    axios_auth.patch(STAFF_ENDPOINTS.ENABLE.replace("{id}", id)),

  disable: (id: string) =>
    axios_auth.patch(STAFF_ENDPOINTS.DISABLE.replace("{id}", id)),

  delete: (id: string) =>
    axios_auth.patch(STAFF_ENDPOINTS.DELETE.replace("{id}", id)),

  // Query

  getById: (id: string) =>
    axios_auth.get(STAFF_ENDPOINTS.GET_BY_ID.replace("{id}", id)),

  getAll: (pagination: PaginationInfo) =>
    axios_auth.get(STAFF_ENDPOINTS.GET_ALL, {
      params: pagination,
    }),

  getActive: (pagination: PaginationInfo) =>
    axios_auth.get(STAFF_ENDPOINTS.GET_ACTIVE, {
      params: pagination,
    }),

  searchByName: (name: string, pagination: PaginationInfo) =>
    axios_auth.get(STAFF_ENDPOINTS.SEARCH_BY_NAME, {
      params: {
        query: name,
        ...pagination,
      },
    }),

  // Count
  count: () => axios_auth.get(STAFF_ENDPOINTS.COUNT),
};
