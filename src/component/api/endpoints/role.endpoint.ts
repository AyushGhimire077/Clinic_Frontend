const BASE = "roles";

export const ROLE_ENDPOINTS = {
  // Command
  CREATE: BASE,
  UPDATE: `${BASE}/{id}`,
  ENABLE: `${BASE}/{id}/enable`,
  DISABLE: `${BASE}/{id}/disable`,

  // Query
  GET_ALL: `${BASE}/list`,
  GET_ACTIVE: `${BASE}/active`,
  SEARCH_BY_NAME: `${BASE}/search`,

  // Count
  GET_BY_ID: `${BASE}/{id}`,
};
