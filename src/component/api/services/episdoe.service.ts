import type { IEpisodeRequest } from "../../../pages/episode/helper/episode.interface";
import type {
  DateRange,
  PaginationInfo,
} from "../../constant/global.interface";
import { axios_auth } from "../../global/config";
import { EPISODE_ENDPOINT } from "../endpoints/episode.endpoint";

export const EpisodeService = {
  create: (data: IEpisodeRequest) =>
    axios_auth.post(EPISODE_ENDPOINT.REGISTER, data),
  delete: (id: string) =>
    axios_auth.delete(EPISODE_ENDPOINT.REMOVE.replace("{id}", id)),
  changeStatus: (id: string, status: string) =>
    axios_auth.patch(EPISODE_ENDPOINT.CHANGE_STATUS.replace("{id}", id), {
      status,
    }),
  changeType: (id: string, type: string) =>
    axios_auth.patch(EPISODE_ENDPOINT.CHANGE_TYPE.replace("{id}", id), {
      type,
    }),
  changeBillingMode: (id: string, billingMode: string) =>
    axios_auth.patch(EPISODE_ENDPOINT.CHANGE_BILLING_MODE.replace("{id}", id), {
      billingMode,
    }),

  /* Queries */
  getAll: (pagination: PaginationInfo) =>
    axios_auth.get(EPISODE_ENDPOINT.GET_ALL, { params: { ...pagination } }),
  getActive: (pagination: PaginationInfo) =>
    axios_auth.get(EPISODE_ENDPOINT.GET_ACTIVE, { params: { ...pagination } }),
  getByStatus: (status: string, pagination: PaginationInfo) =>
    axios_auth.get(EPISODE_ENDPOINT.GET_BY_STATUS.replace("{status}", status), {
      params: { ...pagination },
    }),

  getByRange: (range: DateRange, pagination: PaginationInfo) =>
    axios_auth.get(EPISODE_ENDPOINT.GET_ALL_RANGE, {
      params: { range, ...pagination },
    }),
  getByStatusRange: (
    status: string,
    range: DateRange,
    pagination: PaginationInfo
  ) =>
    axios_auth.get(
      EPISODE_ENDPOINT.GET_BY_STATUS_RANGE.replace("{status}", status),
      {
        params: { range, ...pagination },
      }
    ),

  countAllTime: () => axios_auth.get(EPISODE_ENDPOINT.COUNT_ALL_TIME),
  countByRange: (range: DateRange) =>
    axios_auth.get(EPISODE_ENDPOINT.COUNT_BY_RANGE, { params: { range } }),
};
