import { set } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const formatDateTimeZone = (date: string) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const now = new Date();

  // Interpreta a data como LOCAL (00:00 no timezone do usuário)
  const localMidnight = fromZonedTime(`${date}T00:00:00`, timeZone);

  // Aplica hora UTC corretamente
  const updatedUtcDate = set(localMidnight, {
    hours: now.getUTCHours(),
    minutes: now.getUTCMinutes(),
    seconds: now.getUTCSeconds(),
    milliseconds: now.getUTCMilliseconds(),
  });

  return formatInTimeZone(
    updatedUtcDate,
    timeZone,
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
  );
};
