export function isSessionLive(startTime: string | Date, endTime: string | Date): boolean {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  return now >= start && now <= end;
}

export function formatSessionDate(startTime: string | Date, endTime: string | Date): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Date inconnue';
  }

  const sameDay = start.toDateString() === end.toDateString();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const startDateStr = start.toLocaleDateString('fr-FR', dateOptions);
  const endDateStr = end.toLocaleDateString('fr-FR', dateOptions);
  const startTimeStr = start.toLocaleTimeString('fr-FR', timeOptions);
  const endTimeStr = end.toLocaleTimeString('fr-FR', timeOptions);

  if (sameDay) {
    return `${startDateStr} · ${startTimeStr} – ${endTimeStr}`;
  }

  return `${startDateStr} · ${startTimeStr} → ${endDateStr} · ${endTimeStr}`;
}

export function formatEventDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Date inconnue';
  }

  const sameDay = start.toDateString() === end.toDateString();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const startDateStr = start.toLocaleDateString('fr-FR', dateOptions);
  const endDateStr = end.toLocaleDateString('fr-FR', dateOptions);

  return sameDay ? startDateStr : `${startDateStr} → ${endDateStr}`;
}