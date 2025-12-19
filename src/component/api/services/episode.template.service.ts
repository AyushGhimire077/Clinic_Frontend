import type {
  IEpisodeTemp,
  IEpisodeTempReq,
} from "../../../pages/episode/helper/episode.interface";
import type { PaginationInfo } from "../../constant/global.interface";
import { axios_auth } from "../../global/config";
import { EPISODE_TEMPLATE_ENDPOINT } from "../endpoints/episode.template.endpoint";

export const EpisodeTemplateService = {
  create: (data: IEpisodeTempReq) =>
    axios_auth.post(EPISODE_TEMPLATE_ENDPOINT.CREATE, data),
  update: (id: string, data: IEpisodeTempReq) =>
    axios_auth.put(
      EPISODE_TEMPLATE_ENDPOINT.UPDATE.replace("{id}", `${id}`),
      data
    ),
  delete: (id: string) =>
    axios_auth.delete(
      EPISODE_TEMPLATE_ENDPOINT.DELETE.replace("{id}", `${id}`)
    ),
  enable: (id: string) =>
    axios_auth.post(EPISODE_TEMPLATE_ENDPOINT.ENABLE.replace("{id}", `${id}`)),
  disable: (id: string) =>
    axios_auth.post(EPISODE_TEMPLATE_ENDPOINT.DISABLE.replace("{id}", `${id}`)),

  // query

  getAll: (paginatoin: PaginationInfo) =>
    axios_auth.get(EPISODE_TEMPLATE_ENDPOINT.GET_ALL, {
      params: paginatoin,
    }),
  getActive: (paginatoin: PaginationInfo) =>
    axios_auth.get(EPISODE_TEMPLATE_ENDPOINT.GET_ACTIVE, {
      params: paginatoin,
    }),
  getById: (id: string) =>
    axios_auth.get<IEpisodeTemp>(
      EPISODE_TEMPLATE_ENDPOINT.GET_BY_ID.replace("{id}", `${id}`)
    ),
  searchByName: (name: string, paginatoin: PaginationInfo) =>
    axios_auth.get(EPISODE_TEMPLATE_ENDPOINT.SEARCH_BY_NAME, {
      params: { name, ...paginatoin },
    }),
};
