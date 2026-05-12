import styles from './EventCard.module.css'

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Date inconnue'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const options = { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
  const startText = start.toLocaleDateString('fr-FR', options)
  const endText = end.toLocaleDateString('fr-FR', options)
  return `${startText} — ${endText}`
}

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
    <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1Zm-2 8V8h18v2H4Zm0 3v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7H4Z" fill="currentColor" />
  </svg>
)

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor" />
  </svg>
)

export default function EventCard({ title, description, place, startDate, endDate, image = undefined }) {
  const style = image ? { backgroundImage: `url(${image})` } : undefined

  return (
    <article className={styles.card} style={style}>
      <div className={styles.overlay} />
      <div className={styles.body}>
        <header className={styles.header}>
          <span className={styles.badge}><h2 className={styles.title}>{title}</h2></span>
        </header>

        <p className={styles.description}>{description || 'Aucune description disponible pour cet événement.'}</p>
      </div>

      <div className={styles.footerDate}>
        <CalendarIcon />
        <span>{formatDateRange(startDate, endDate)}</span>
      </div>

      <div className={styles.footerPlace}>
        <LocationIcon />
        <span>{place || 'Lieu à confirmer'}</span>
      </div>
    </article>
  )
}
