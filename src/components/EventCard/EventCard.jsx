'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './EventCard.module.css'
import { useAdmin } from '@/context/AdminContext'
import EventFormModal from '@/components/EventFormModal/EventFormModal'

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Date inconnue'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const options = { weekday: 'short', day: '2-digit', month: 'short' }
  return `${start.toLocaleDateString('fr-FR', options)} — ${end.toLocaleDateString('fr-FR', options)}`
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

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.arrowIcon}>
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function EventCard({ id, title, description, place, startDate, endDate, image = undefined, onRefresh }) {
  const { isAdmin, token } = useAdmin()
  const [showEdit, setShowEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const style = image ? { backgroundImage: `url(${image})` } : undefined

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`Supprimer l'événement "${title}" ? Cette action est irréversible.`)) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (onRefresh) onRefresh()
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowEdit(true)
  }

  return (
    <>
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
        <div className="flex items-center justify-between px-4 pb-3">
          <Link href={`/event/${id}`} className={styles.footerArrow}>
            <ArrowIcon />
          </Link>
          {isAdmin && (
            <div className="flex items-center gap-2 z-10 relative">
              <button onClick={handleEdit} title="Modifier"
                className="p-2 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:bg-sky-500/40 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={handleDelete} disabled={deleting} title="Supprimer"
                className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/40 disabled:opacity-50 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </article>
      {showEdit && (
        <EventFormModal
          event={{ id, title, description: description || '', startDate, endDate, place: place || '' }}
          onClose={() => setShowEdit(false)}
          onSuccess={() => { if (onRefresh) onRefresh() }}
        />
      )}
    </>
  )
}
