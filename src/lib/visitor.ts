export function getVisitorId(): string {
  if (typeof window === 'undefined') {
    return 'server-side';
  }

  let visitorId = localStorage.getItem('visitorId');

  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15) + 
                Date.now().toString(36);
    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
}

// Optionnel : fonction pour réinitialiser (utile en dev)
export function resetVisitorId() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('visitorId');
  }
}