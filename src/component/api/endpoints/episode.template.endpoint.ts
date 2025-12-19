
const BASE = 'templates';

export const EPISODE_TEMPLATE_ENDPOINT = {
 
     CREATE: BASE,
     UPDATE:  `${BASE}/{id}`,
     DELETE: `${BASE}/{id}`,
     ENABLE: `${BASE}/{id}/enable`,
     DISABLE: `${BASE}/{id}/disable`,

    //  query
     GET_ALL: BASE,
     GET_ACTIVE: `${BASE}/active`,
     GET_BY_ID: `${BASE}/{id}`,
     SEARCH_BY_NAME: `${BASE}/search`,

}