export function isSessionLive(startTime: string | Date, endTime: string | Date): boolean {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  return now >= start && now <= end;
}

export function formatSessionDate(startTime: string | Date, endTime: string | Date): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const dateStr = start.toLocaleDateString('fr-FR', dateOptions);
  const startTimeStr = start.toLocaleTimeString('fr-FR', timeOptions);
  const endTimeStr = end.toLocaleTimeString('fr-FR', timeOptions);

  return `${dateStr} à ${startTimeStr} — ${endTimeStr}`;
}