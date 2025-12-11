import { toZonedTime, format } from "date-fns-tz";

const TIME_ZONE = "Asia/Kathmandu";

export const getLocalDateTime = (): string => {
  const now = new Date();
  const zonedDate = toZonedTime(now, TIME_ZONE);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm", { timeZone: TIME_ZONE });
};
