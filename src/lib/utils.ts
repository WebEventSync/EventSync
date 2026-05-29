export function isSessionLive(startTime: string | Date, endTime: string | Date): boolean {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
}

export function formatSessionDate(startTime: string | Date, endTime: string | Date): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long'
  };
  
  return `${start.toLocaleDateString('fr-FR', dateOptions)} • ${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}