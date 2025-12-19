const BASE = "episodes";

export const EPISODE_ENDPOINT = {
  // Command
  REGISTER: BASE,
  REMOVE: `${BASE}/{id}/delete`,
  CHANGE_STATUS: `${BASE}/"{id}/status"`,
  CHANGE_TYPE: `${BASE}/"{id}/type"`,
  CHANGE_BILLING_MODE: `${BASE}/"{id}/billing-mode"`,

  // Query
  GET_ACTIVE: `${BASE}/active`,
  GET_ALL: BASE,
  GET_ALL_RANGE: `${BASE}/range`,
  GET_BY_STATUS: `${BASE}/status/{status}`,
  GET_BY_STATUS_RANGE: `${BASE}/status/{status}/range`,

  // Count
  COUNT_BY_RANGE: `${BASE}/count`,
  COUNT_ALL_TIME: `${BASE}/count/all-time`,
};
