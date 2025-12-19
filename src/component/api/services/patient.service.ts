import type { IPatientRequest } from "../../../pages/patient/helper/patient.interface";
import type { PaginationInfo } from "../../constant/global.interface";
import { axios_auth } from "../../global/config";
import { PatientEndpoint } from "../endpoints/patient.endpoint";

export const PatientService = {
  create: (data: IPatientRequest) =>
    axios_auth.post(PatientEndpoint.REGISTER, data),

  update: (id: string, data: IPatientRequest) =>
    axios_auth.put(PatientEndpoint.UPDATE.replace("{id}", id), data),

  enable: (id: string) =>
    axios_auth.patch(PatientEndpoint.ENABLE.replace("{id}", id)),

  disable: (id: string) =>
    axios_auth.patch(PatientEndpoint.DISABLE.replace("{id}", id)),

  getById: (id: string) =>
    axios_auth.get(PatientEndpoint.GET_BY_ID.replace("{id}", id)),

  getAll: (pagination: PaginationInfo) =>
    axios_auth.get(PatientEndpoint.GET_ALL, {
      params: pagination,
    }),

  getActive: (pagination: PaginationInfo) =>
    axios_auth.get(PatientEndpoint.GET_ACTIVE, {
      params: pagination,
    }),

  searchByName: (name: string, pagination: PaginationInfo) =>
    axios_auth.get(PatientEndpoint.SEARCH_BY_NAME, {
      params: {
        query: name,
        ...pagination,
      },
    }),

  count: () => axios_auth.get(PatientEndpoint.COUNT),
};
