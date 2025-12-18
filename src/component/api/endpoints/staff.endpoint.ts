const BASE = "staff";

export const STAFF_ENDPOINTS = {
  // Command
  CREATE: BASE,
  UPDATE: `${BASE}/{id}`,
  ENABLE: `${BASE}/{id}/enable`,
  DISABLE: `${BASE}/{id}/disable`,
  DELETE: `${BASE}/{id}/delete`,

  // Query
  GET_ALL: `${BASE}/list`,
  GET_ACTIVE: `${BASE}/active`,
  SEARCH_BY_NAME: `${BASE}/search`,

  // Count
  COUNT: `${BASE}/count`,
};
