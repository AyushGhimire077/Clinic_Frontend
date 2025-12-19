const BASE = "patients";
export const PatientEndpoint = {
  REGISTER: BASE,
  UPDATE: `${BASE}/{id}`,
  ENABLE: `${BASE}/{id}/enable`,
  DISABLE: `${BASE}/{id}/disable`,

  GET_ALL: `${BASE}/list`,
  GET_ACTIVE: `${BASE}/active`,
  SEARCH_BY_NAME: `${BASE}/search`,
  COUNT: `${BASE}/count`,
  GET_BY_ID: `${BASE}/{id}`,
};
