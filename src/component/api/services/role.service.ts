import type { IRoleRequest } from "../../../pages/staff/role.helper/role.interface";
import type { PaginationInfo } from "../../constant/global.interface";
import { axios_auth } from "../../global/config";
import { ROLE_ENDPOINTS } from "../endpoints/role.endpoint";

export const RoleService = {
  create: (data: IRoleRequest) => axios_auth.post(ROLE_ENDPOINTS.CREATE, data),
  update: (id: string, data: IRoleRequest) =>
    axios_auth.put(ROLE_ENDPOINTS.UPDATE.replace("{id}", id), data),

  enable: (id: string) =>
    axios_auth.patch(ROLE_ENDPOINTS.ENABLE.replace("{id}", id)),

  disable: (id: string) =>
    axios_auth.patch(ROLE_ENDPOINTS.DISABLE.replace("{id}", id)),

  // Query
  getAll: (pagination: PaginationInfo) =>
    axios_auth.get(ROLE_ENDPOINTS.GET_ALL, {
      params: {
        pagination,
      },
    }),

  getActive: (pagination: PaginationInfo) =>
    axios_auth.get(ROLE_ENDPOINTS.GET_ACTIVE, {
      params: { pagination },
    }),

  searchByName: (name: string, pagination: PaginationInfo) =>
    axios_auth.get(ROLE_ENDPOINTS.SEARCH_BY_NAME, {
      params: {
        query: name,
        ...pagination,
      },
    }),

  // By Id
  getById: (id: string) =>
    axios_auth.get(ROLE_ENDPOINTS.GET_BY_ID.replace("{id}", id)),
};
